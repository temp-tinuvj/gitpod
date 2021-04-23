/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

// package: registryfacade
// file: provider.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as provider_pb from "./provider_pb";
import * as imagespec_pb from "./imagespec_pb";
import * as content_service_api_initializer_pb from "@gitpod/content-service/lib";

interface ISpecProviderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getImageSpec: ISpecProviderService_IGetImageSpec;
    getOfflineImageSpec: ISpecProviderService_IGetOfflineImageSpec;
}

interface ISpecProviderService_IGetImageSpec extends grpc.MethodDefinition<provider_pb.GetImageSpecRequest, provider_pb.GetImageSpecResponse> {
    path: "/registryfacade.SpecProvider/GetImageSpec";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<provider_pb.GetImageSpecRequest>;
    requestDeserialize: grpc.deserialize<provider_pb.GetImageSpecRequest>;
    responseSerialize: grpc.serialize<provider_pb.GetImageSpecResponse>;
    responseDeserialize: grpc.deserialize<provider_pb.GetImageSpecResponse>;
}
interface ISpecProviderService_IGetOfflineImageSpec extends grpc.MethodDefinition<provider_pb.GetOfflineImageSpecRequest, provider_pb.GetImageSpecResponse> {
    path: "/registryfacade.SpecProvider/GetOfflineImageSpec";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<provider_pb.GetOfflineImageSpecRequest>;
    requestDeserialize: grpc.deserialize<provider_pb.GetOfflineImageSpecRequest>;
    responseSerialize: grpc.serialize<provider_pb.GetImageSpecResponse>;
    responseDeserialize: grpc.deserialize<provider_pb.GetImageSpecResponse>;
}

export const SpecProviderService: ISpecProviderService;

export interface ISpecProviderServer extends grpc.UntypedServiceImplementation {
    getImageSpec: grpc.handleUnaryCall<provider_pb.GetImageSpecRequest, provider_pb.GetImageSpecResponse>;
    getOfflineImageSpec: grpc.handleUnaryCall<provider_pb.GetOfflineImageSpecRequest, provider_pb.GetImageSpecResponse>;
}

export interface ISpecProviderClient {
    getImageSpec(request: provider_pb.GetImageSpecRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    getImageSpec(request: provider_pb.GetImageSpecRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    getImageSpec(request: provider_pb.GetImageSpecRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
}

export class SpecProviderClient extends grpc.Client implements ISpecProviderClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getImageSpec(request: provider_pb.GetImageSpecRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    public getImageSpec(request: provider_pb.GetImageSpecRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    public getImageSpec(request: provider_pb.GetImageSpecRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    public getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    public getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
    public getOfflineImageSpec(request: provider_pb.GetOfflineImageSpecRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetImageSpecResponse) => void): grpc.ClientUnaryCall;
}

interface IContextProviderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getWorkspaceContext: IContextProviderService_IGetWorkspaceContext;
}

interface IContextProviderService_IGetWorkspaceContext extends grpc.MethodDefinition<provider_pb.GetWorkspaceContextRequest, provider_pb.GetWorkspaceContextResponse> {
    path: "/registryfacade.ContextProvider/GetWorkspaceContext";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<provider_pb.GetWorkspaceContextRequest>;
    requestDeserialize: grpc.deserialize<provider_pb.GetWorkspaceContextRequest>;
    responseSerialize: grpc.serialize<provider_pb.GetWorkspaceContextResponse>;
    responseDeserialize: grpc.deserialize<provider_pb.GetWorkspaceContextResponse>;
}

export const ContextProviderService: IContextProviderService;

export interface IContextProviderServer extends grpc.UntypedServiceImplementation {
    getWorkspaceContext: grpc.handleUnaryCall<provider_pb.GetWorkspaceContextRequest, provider_pb.GetWorkspaceContextResponse>;
}

export interface IContextProviderClient {
    getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
    getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
    getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
}

export class ContextProviderClient extends grpc.Client implements IContextProviderClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
    public getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
    public getWorkspaceContext(request: provider_pb.GetWorkspaceContextRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: provider_pb.GetWorkspaceContextResponse) => void): grpc.ClientUnaryCall;
}
