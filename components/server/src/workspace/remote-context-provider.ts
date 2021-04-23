/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import * as crypto from "crypto";
import { inject, injectable } from "inversify";
import { ContextProviderService, IContextProviderServer } from "@gitpod/registry-facade/lib/provider_grpc_pb";
import { GetWorkspaceContextRequest, GetWorkspaceContextResponse, StartWorkspaceSpec, WorkspaceMetadata } from "@gitpod/registry-facade/lib/provider_pb";
import { ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { GitpodTokenType, User } from "@gitpod/gitpod-protocol";
import { DBWithTracing, TracedUserDB } from "@gitpod/gitpod-db/lib/traced-db";
import { UserDB } from "@gitpod/gitpod-db/lib/user-db";
import { TraceContext } from "@gitpod/gitpod-protocol/lib/util/tracing";
import { ContextParser } from "./context-parser-service";
import { WorkspaceFactory } from "./workspace-factory";
import { WorkspaceStarter } from "./workspace-starter";
import { EnvironmentVariable, EnvVarApplication } from "@gitpod/registry-facade/lib/imagespec_pb";
import * as grpc from '@grpc/grpc-js';
import { log } from "@gitpod/gitpod-protocol/lib/util/logging";


@injectable()
export class RemoteContextProvider {
    @inject(TracedUserDB) protected readonly userDB: DBWithTracing<UserDB>;
    @inject(ContextParser) protected readonly contextParser: ContextParser;
    @inject(WorkspaceFactory) protected readonly workspaceFactory: WorkspaceFactory;
    @inject(WorkspaceStarter) protected readonly workspaceStarter: WorkspaceStarter;

    public server: IContextProviderServer = {
        getWorkspaceContext: (call: ServerUnaryCall<GetWorkspaceContextRequest, GetWorkspaceContextResponse>, cb: sendUnaryData<GetWorkspaceContextResponse>) => {
            this.getWorkspaceContext(call)
                .then((r: GetWorkspaceContextResponse) => cb(null, r))
                .catch(err => cb(err));
        }
    }

    public async startServer(port: string) {
        const server = new grpc.Server();
        server.addService(ContextProviderService, this.server);
        await new Promise<void>((resolve, reject) => {
            server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, prt) => {
                if (!!err) {
                    reject(err);
                } else {
                    log.info("remote context provider listening on "+prt);
                    resolve();
                }
            });
        });
        server.start();
    }

    public async getWorkspaceContext(call: ServerUnaryCall<GetWorkspaceContextRequest, GetWorkspaceContextResponse>): Promise<GetWorkspaceContextResponse> {
        const ctx: TraceContext = {};
        const user = await this.getUser(ctx, call.metadata);
        if (!user) {
            log.debug("getWorkspaceContext: no user found from metadata");
            throw { code: Status.UNAUTHENTICATED };
        }

        const normalizedContextUrl = this.contextParser.normalizeContextURL(call.request.getContextUrl());
        const context = await this.contextParser.handle(ctx, user, normalizedContextUrl);
        const workspace = await this.workspaceFactory.createForContext(ctx, user, context, normalizedContextUrl);
        const envVars = await this.userDB.trace(ctx).getEnvVars(user.id);
        const instance = await this.workspaceStarter.newInstance(workspace, user);
        const baseRef = await this.workspaceStarter.resolveBaseImage(ctx, user, workspace, instance, false);
        if (baseRef.actuallyNeedsBuild) {
            throw {code: Status.FAILED_PRECONDITION, message: "need to build base image"};
        }
        instance.workspaceImage = baseRef.ref;
        const originalspec = await this.workspaceStarter.createSpec(ctx, user, workspace, instance, envVars);

        const spec = new StartWorkspaceSpec();
        spec.setAdmission(originalspec.getAdmission());
        spec.setCheckoutLocation(originalspec.getCheckoutLocation());
        spec.setEnvvarsList(originalspec.getEnvvarsList().map(e => {
            const r = new EnvironmentVariable();
            r.setName(e.getName());
            r.setValue(e.getValue());
            r.setMode(EnvVarApplication.OVERWRITE);
            return r;
        }));
        spec.setGit(originalspec.getGit());
        spec.setIdeImage(originalspec.getIdeImage());
        spec.setInitializer(originalspec.getInitializer());
        spec.setPortsList(originalspec.getPortsList());
        spec.setTimeout(originalspec.getTimeout());
        spec.setWorkspaceImage(originalspec.getWorkspaceImage());
        spec.setWorkspaceLocation(originalspec.getWorkspaceLocation());

        const resp = new GetWorkspaceContextResponse();
        resp.setId(instance.id);
        resp.setMetadata((() => {
            const md = new WorkspaceMetadata();
            md.setMetaId(workspace.id);
            md.setOwner(workspace.ownerId);
            return md;
        })());
        resp.setServicePrefix(workspace.id);
        resp.setSpec(spec);
        
        return resp;
    }

    protected async getUser(ctx: TraceContext, metadata: Metadata): Promise<User | undefined> {
        log.debug("getUser from gRPC metadata", { metadata: metadata.getMap() })
        const auth = metadata.get("authorization");
        if (!auth || auth.length === 0) {
            return;
        }

        const token = auth[0].toString();
        console.log({auth, token});
        const hash = crypto.createHash('sha256').update(token, 'utf8').digest("hex");

        const user = await this.userDB.trace(ctx).findUserByGitpodToken(hash, GitpodTokenType.MACHINE_AUTH_TOKEN)
        if (!user) {
            return;
        }

        return this.userDB.trace(ctx).findUserById(user.user.id);
    }

}
