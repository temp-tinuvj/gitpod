/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

// package: registryfacade
// file: provider.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as imagespec_pb from "./imagespec_pb";
import * as content_service_api_initializer_pb from "@gitpod/content-service/lib";

export class GetImageSpecRequest extends jspb.Message {
    getId(): string;
    setId(value: string): GetImageSpecRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetImageSpecRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetImageSpecRequest): GetImageSpecRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetImageSpecRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetImageSpecRequest;
    static deserializeBinaryFromReader(message: GetImageSpecRequest, reader: jspb.BinaryReader): GetImageSpecRequest;
}

export namespace GetImageSpecRequest {
    export type AsObject = {
        id: string,
    }
}

export class GetOfflineImageSpecRequest extends jspb.Message {

    hasReq(): boolean;
    clearReq(): void;
    getReq(): GetWorkspaceContextResponse | undefined;
    setReq(value?: GetWorkspaceContextResponse): GetOfflineImageSpecRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOfflineImageSpecRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetOfflineImageSpecRequest): GetOfflineImageSpecRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOfflineImageSpecRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOfflineImageSpecRequest;
    static deserializeBinaryFromReader(message: GetOfflineImageSpecRequest, reader: jspb.BinaryReader): GetOfflineImageSpecRequest;
}

export namespace GetOfflineImageSpecRequest {
    export type AsObject = {
        req?: GetWorkspaceContextResponse.AsObject,
    }
}

export class GetImageSpecResponse extends jspb.Message {

    hasSpec(): boolean;
    clearSpec(): void;
    getSpec(): imagespec_pb.ImageSpec | undefined;
    setSpec(value?: imagespec_pb.ImageSpec): GetImageSpecResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetImageSpecResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetImageSpecResponse): GetImageSpecResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetImageSpecResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetImageSpecResponse;
    static deserializeBinaryFromReader(message: GetImageSpecResponse, reader: jspb.BinaryReader): GetImageSpecResponse;
}

export namespace GetImageSpecResponse {
    export type AsObject = {
        spec?: imagespec_pb.ImageSpec.AsObject,
    }
}

export class GetWorkspaceContextRequest extends jspb.Message {
    getContextUrl(): string;
    setContextUrl(value: string): GetWorkspaceContextRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetWorkspaceContextRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetWorkspaceContextRequest): GetWorkspaceContextRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetWorkspaceContextRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetWorkspaceContextRequest;
    static deserializeBinaryFromReader(message: GetWorkspaceContextRequest, reader: jspb.BinaryReader): GetWorkspaceContextRequest;
}

export namespace GetWorkspaceContextRequest {
    export type AsObject = {
        contextUrl: string,
    }
}

export class GetWorkspaceContextResponse extends jspb.Message {
    getId(): string;
    setId(value: string): GetWorkspaceContextResponse;
    getServicePrefix(): string;
    setServicePrefix(value: string): GetWorkspaceContextResponse;

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): WorkspaceMetadata | undefined;
    setMetadata(value?: WorkspaceMetadata): GetWorkspaceContextResponse;

    hasSpec(): boolean;
    clearSpec(): void;
    getSpec(): StartWorkspaceSpec | undefined;
    setSpec(value?: StartWorkspaceSpec): GetWorkspaceContextResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetWorkspaceContextResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetWorkspaceContextResponse): GetWorkspaceContextResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetWorkspaceContextResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetWorkspaceContextResponse;
    static deserializeBinaryFromReader(message: GetWorkspaceContextResponse, reader: jspb.BinaryReader): GetWorkspaceContextResponse;
}

export namespace GetWorkspaceContextResponse {
    export type AsObject = {
        id: string,
        servicePrefix: string,
        metadata?: WorkspaceMetadata.AsObject,
        spec?: StartWorkspaceSpec.AsObject,
    }
}

export class StartWorkspaceSpec extends jspb.Message {
    getWorkspaceImage(): string;
    setWorkspaceImage(value: string): StartWorkspaceSpec;
    getIdeImage(): string;
    setIdeImage(value: string): StartWorkspaceSpec;

    hasInitializer(): boolean;
    clearInitializer(): void;
    getInitializer(): content_service_api_initializer_pb.WorkspaceInitializer | undefined;
    setInitializer(value?: content_service_api_initializer_pb.WorkspaceInitializer): StartWorkspaceSpec;
    clearPortsList(): void;
    getPortsList(): Array<PortSpec>;
    setPortsList(value: Array<PortSpec>): StartWorkspaceSpec;
    addPorts(value?: PortSpec, index?: number): PortSpec;
    clearEnvvarsList(): void;
    getEnvvarsList(): Array<imagespec_pb.EnvironmentVariable>;
    setEnvvarsList(value: Array<imagespec_pb.EnvironmentVariable>): StartWorkspaceSpec;
    addEnvvars(value?: imagespec_pb.EnvironmentVariable, index?: number): imagespec_pb.EnvironmentVariable;
    getCheckoutLocation(): string;
    setCheckoutLocation(value: string): StartWorkspaceSpec;
    getWorkspaceLocation(): string;
    setWorkspaceLocation(value: string): StartWorkspaceSpec;

    hasGit(): boolean;
    clearGit(): void;
    getGit(): GitSpec | undefined;
    setGit(value?: GitSpec): StartWorkspaceSpec;
    getTimeout(): string;
    setTimeout(value: string): StartWorkspaceSpec;
    getAdmission(): AdmissionLevel;
    setAdmission(value: AdmissionLevel): StartWorkspaceSpec;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StartWorkspaceSpec.AsObject;
    static toObject(includeInstance: boolean, msg: StartWorkspaceSpec): StartWorkspaceSpec.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StartWorkspaceSpec, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StartWorkspaceSpec;
    static deserializeBinaryFromReader(message: StartWorkspaceSpec, reader: jspb.BinaryReader): StartWorkspaceSpec;
}

export namespace StartWorkspaceSpec {
    export type AsObject = {
        workspaceImage: string,
        ideImage: string,
        initializer?: content_service_api_initializer_pb.WorkspaceInitializer.AsObject,
        portsList: Array<PortSpec.AsObject>,
        envvarsList: Array<imagespec_pb.EnvironmentVariable.AsObject>,
        checkoutLocation: string,
        workspaceLocation: string,
        git?: GitSpec.AsObject,
        timeout: string,
        admission: AdmissionLevel,
    }
}

export class GitSpec extends jspb.Message {
    getUsername(): string;
    setUsername(value: string): GitSpec;
    getEmail(): string;
    setEmail(value: string): GitSpec;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GitSpec.AsObject;
    static toObject(includeInstance: boolean, msg: GitSpec): GitSpec.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GitSpec, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GitSpec;
    static deserializeBinaryFromReader(message: GitSpec, reader: jspb.BinaryReader): GitSpec;
}

export namespace GitSpec {
    export type AsObject = {
        username: string,
        email: string,
    }
}

export class PortSpec extends jspb.Message {
    getPort(): number;
    setPort(value: number): PortSpec;
    getTarget(): number;
    setTarget(value: number): PortSpec;
    getVisibility(): PortVisibility;
    setVisibility(value: PortVisibility): PortSpec;
    getUrl(): string;
    setUrl(value: string): PortSpec;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PortSpec.AsObject;
    static toObject(includeInstance: boolean, msg: PortSpec): PortSpec.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PortSpec, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PortSpec;
    static deserializeBinaryFromReader(message: PortSpec, reader: jspb.BinaryReader): PortSpec;
}

export namespace PortSpec {
    export type AsObject = {
        port: number,
        target: number,
        visibility: PortVisibility,
        url: string,
    }
}

export class WorkspaceMetadata extends jspb.Message {
    getOwner(): string;
    setOwner(value: string): WorkspaceMetadata;
    getMetaId(): string;
    setMetaId(value: string): WorkspaceMetadata;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WorkspaceMetadata.AsObject;
    static toObject(includeInstance: boolean, msg: WorkspaceMetadata): WorkspaceMetadata.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: WorkspaceMetadata, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WorkspaceMetadata;
    static deserializeBinaryFromReader(message: WorkspaceMetadata, reader: jspb.BinaryReader): WorkspaceMetadata;
}

export namespace WorkspaceMetadata {
    export type AsObject = {
        owner: string,
        metaId: string,
    }
}

export enum PortVisibility {
    PORT_VISIBILITY_PRIVATE = 0,
    PORT_VISIBILITY_PUBLIC = 1,
}

export enum AdmissionLevel {
    ADMIT_OWNER_ONLY = 0,
    ADMIT_EVERYONE = 1,
}
