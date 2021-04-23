// Copyright (c) 2020 Gitpod GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License-AGPL.txt in the project root for license information.

package manager

import (
	"context"
	"encoding/base64"

	"github.com/opentracing/opentracing-go"
	"golang.org/x/xerrors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"

	wsk8s "github.com/gitpod-io/gitpod/common-go/kubernetes"
	"github.com/gitpod-io/gitpod/common-go/tracing"
	csapi "github.com/gitpod-io/gitpod/content-service/api"
	regapi "github.com/gitpod-io/gitpod/registry-facade/api"
	"github.com/gitpod-io/gitpod/ws-manager/api"
)

// GetImageSpec provides the image spec for a particular workspace (instance) ID.
func (m *Manager) GetImageSpec(ctx context.Context, req *regapi.GetImageSpecRequest) (resp *regapi.GetImageSpecResponse, err error) {
	pod, err := m.findWorkspacePod(ctx, req.Id)
	if isKubernetesObjNotFoundError(err) {
		return nil, status.Error(codes.NotFound, "not found")
	}

	var (
		span        opentracing.Span
		traceID, ok = pod.Annotations[wsk8s.TraceIDAnnotation]
	)
	if ok {
		spanCtx := tracing.FromTraceID(traceID)
		span = opentracing.StartSpan("GetImageSpec", opentracing.FollowsFrom(spanCtx))
		ctx = opentracing.ContextWithSpan(ctx, span)
	} else {
		span, ctx = tracing.FromContext(ctx, "GetImageSpec")
	}
	tracing.ApplyOWI(span, wsk8s.GetOWIFromObject(&pod.ObjectMeta))
	defer func() {
		tracing.LogMessageSafe(span, "resp", resp)
		tracing.FinishSpan(span, &err)
	}()

	ispec, ok := pod.Annotations[workspaceImageSpecAnnotation]
	if !ok {
		return nil, status.Error(codes.FailedPrecondition, "workspace has no image spec")
	}
	spec, err := regapi.ImageSpecFromBase64(ispec)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	if _, ok := pod.Labels[fullWorkspaceBackupAnnotation]; ok {
		owner := pod.Labels[wsk8s.OwnerLabel]
		workspaceID := pod.Labels[wsk8s.MetaIDLabel]
		initializerRaw, ok := pod.Annotations[workspaceInitializerAnnotation]
		if !ok {
			return nil, xerrors.Errorf("pod %s has no %s annotation", pod.Name, workspaceInitializerAnnotation)
		}
		initializerPB, err := base64.StdEncoding.DecodeString(initializerRaw)
		if err != nil {
			return nil, xerrors.Errorf("cannot decode init config: %w", err)
		}
		var initializer csapi.WorkspaceInitializer
		err = proto.Unmarshal(initializerPB, &initializer)
		if err != nil {
			return nil, xerrors.Errorf("cannot unmarshal init config: %w", err)
		}
		cl, _, err := m.Content.GetContentLayer(ctx, owner, workspaceID, &initializer)
		if err != nil {
			return nil, xerrors.Errorf("cannot get content layer: %w", err)
		}

		contentLayer := make([]*regapi.ContentLayer, len(cl))
		for i, l := range cl {
			if len(l.Content) > 0 {
				contentLayer[i] = &regapi.ContentLayer{
					Spec: &regapi.ContentLayer_Direct{
						Direct: &regapi.DirectContentLayer{
							Content: l.Content,
						},
					},
				}
				continue
			}

			diffID := l.DiffID
			contentLayer[i] = &regapi.ContentLayer{
				Spec: &regapi.ContentLayer_Remote{
					Remote: &regapi.RemoteContentLayer{
						DiffId:    diffID,
						Digest:    l.Digest,
						MediaType: string(l.MediaType),
						Url:       l.URL,
						Size:      l.Size,
					},
				},
			}
		}
		spec.ContentLayer = contentLayer
	}

	return &regapi.GetImageSpecResponse{
		Spec: spec,
	}, nil
}

func (m *Manager) GetOfflineImageSpec(ctx context.Context, req *regapi.GetOfflineImageSpecRequest) (resp *regapi.GetImageSpecResponse, err error) {
	span, ctx := tracing.FromContext(ctx, "GetOfflineImageSpec")
	defer tracing.FinishSpan(span, &err)
	tracing.LogRequestSafe(span, req)

	metadata := &api.WorkspaceMetadata{
		MetaId: req.Req.Metadata.MetaId,
		Owner:  req.Req.Metadata.Owner,
	}
	ports := make([]*api.PortSpec, len(req.Req.Spec.Ports))
	for i, p := range req.Req.Spec.Ports {
		ports[i] = &api.PortSpec{
			Port:       p.Port,
			Target:     p.Target,
			Visibility: api.PortVisibility(p.Visibility),
			Url:        p.Url,
		}
	}
	envvars := make([]*api.EnvironmentVariable, len(req.Req.Spec.Envvars))
	for i, e := range req.Req.Spec.Envvars {
		envvars[i] = &api.EnvironmentVariable{
			Name:  e.Name,
			Value: e.Value,
		}
	}
	git := &api.GitSpec{
		Username: req.Req.Spec.Git.Username,
		Email:    req.Req.Spec.Git.Email,
	}
	rspec := &api.StartWorkspaceSpec{
		WorkspaceImage:    req.Req.Spec.WorkspaceImage,
		IdeImage:          req.Req.Spec.IdeImage,
		Initializer:       req.Req.Spec.Initializer,
		Ports:             ports,
		Envvars:           envvars,
		CheckoutLocation:  req.Req.Spec.CheckoutLocation,
		WorkspaceLocation: req.Req.Spec.WorkspaceLocation,
		Git:               git,
		Timeout:           req.Req.Spec.Timeout,
		Admission:         api.AdmissionLevel_ADMIT_EVERYONE,
	}
	sctx, err := m.newStartWorkspaceContext(ctx, &api.StartWorkspaceRequest{
		Id:            req.Req.Id,
		ServicePrefix: req.Req.ServicePrefix,
		Metadata:      metadata,
		Spec:          rspec,
		Type:          api.WorkspaceType_REGULAR,
	})
	if err != nil {
		return nil, xerrors.Errorf("cannot create start context: %w", err)
	}
	container, err := m.createWorkspaceContainer(sctx)
	if err != nil {
		return nil, xerrors.Errorf("cannot create workspace container: %w", err)
	}

	spec := regapi.ImageSpec{
		BaseRef: req.Req.Spec.WorkspaceImage,
		IdeRef:  req.Req.Spec.IdeImage,
	}
	cl, _, err := m.Content.GetContentLayer(ctx, req.Req.Metadata.Owner, req.Req.Metadata.MetaId, req.Req.Spec.Initializer)
	if err != nil {
		return nil, xerrors.Errorf("cannot get content layer: %w", err)
	}

	contentLayer := make([]*regapi.ContentLayer, len(cl))
	for i, l := range cl {
		if len(l.Content) > 0 {
			contentLayer[i] = &regapi.ContentLayer{
				Spec: &regapi.ContentLayer_Direct{
					Direct: &regapi.DirectContentLayer{
						Content: l.Content,
					},
				},
			}
			continue
		}

		diffID := l.DiffID
		contentLayer[i] = &regapi.ContentLayer{
			Spec: &regapi.ContentLayer_Remote{
				Remote: &regapi.RemoteContentLayer{
					DiffId:    diffID,
					Digest:    l.Digest,
					MediaType: string(l.MediaType),
					Url:       l.URL,
					Size:      l.Size,
				},
			},
		}
	}
	spec.ContentLayer = contentLayer
	spec.EnvironmentVariable = req.Req.Spec.Envvars
	for _, e := range container.Env {
		spec.EnvironmentVariable = append(spec.EnvironmentVariable, &regapi.EnvironmentVariable{
			Name:  e.Name,
			Value: e.Value,
			Mode:  regapi.EnvVarApplication_OVERWRITE,
		})
	}
	spec.Entrypoint = []string{"/.supervisor/supervisor", "run"}
	return &regapi.GetImageSpecResponse{Spec: &spec}, nil
}
