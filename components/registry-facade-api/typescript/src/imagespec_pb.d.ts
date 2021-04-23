/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

// package: registryfacade
// file: imagespec.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ImageSpec extends jspb.Message {
    getBaseRef(): string;
    setBaseRef(value: string): ImageSpec;
    getIdeRef(): string;
    setIdeRef(value: string): ImageSpec;
    clearContentLayerList(): void;
    getContentLayerList(): Array<ContentLayer>;
    setContentLayerList(value: Array<ContentLayer>): ImageSpec;
    addContentLayer(value?: ContentLayer, index?: number): ContentLayer;
    clearEnvironmentVariableList(): void;
    getEnvironmentVariableList(): Array<EnvironmentVariable>;
    setEnvironmentVariableList(value: Array<EnvironmentVariable>): ImageSpec;
    addEnvironmentVariable(value?: EnvironmentVariable, index?: number): EnvironmentVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ImageSpec.AsObject;
    static toObject(includeInstance: boolean, msg: ImageSpec): ImageSpec.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ImageSpec, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ImageSpec;
    static deserializeBinaryFromReader(message: ImageSpec, reader: jspb.BinaryReader): ImageSpec;
}

export namespace ImageSpec {
    export type AsObject = {
        baseRef: string,
        ideRef: string,
        contentLayerList: Array<ContentLayer.AsObject>,
        environmentVariableList: Array<EnvironmentVariable.AsObject>,
    }
}

export class ContentLayer extends jspb.Message {

    hasRemote(): boolean;
    clearRemote(): void;
    getRemote(): RemoteContentLayer | undefined;
    setRemote(value?: RemoteContentLayer): ContentLayer;

    hasDirect(): boolean;
    clearDirect(): void;
    getDirect(): DirectContentLayer | undefined;
    setDirect(value?: DirectContentLayer): ContentLayer;

    getSpecCase(): ContentLayer.SpecCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ContentLayer.AsObject;
    static toObject(includeInstance: boolean, msg: ContentLayer): ContentLayer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ContentLayer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ContentLayer;
    static deserializeBinaryFromReader(message: ContentLayer, reader: jspb.BinaryReader): ContentLayer;
}

export namespace ContentLayer {
    export type AsObject = {
        remote?: RemoteContentLayer.AsObject,
        direct?: DirectContentLayer.AsObject,
    }

    export enum SpecCase {
        SPEC_NOT_SET = 0,
        REMOTE = 1,
        DIRECT = 2,
    }

}

export class RemoteContentLayer extends jspb.Message {
    getUrl(): string;
    setUrl(value: string): RemoteContentLayer;
    getDigest(): string;
    setDigest(value: string): RemoteContentLayer;
    getDiffId(): string;
    setDiffId(value: string): RemoteContentLayer;
    getMediaType(): string;
    setMediaType(value: string): RemoteContentLayer;
    getSize(): number;
    setSize(value: number): RemoteContentLayer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemoteContentLayer.AsObject;
    static toObject(includeInstance: boolean, msg: RemoteContentLayer): RemoteContentLayer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemoteContentLayer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemoteContentLayer;
    static deserializeBinaryFromReader(message: RemoteContentLayer, reader: jspb.BinaryReader): RemoteContentLayer;
}

export namespace RemoteContentLayer {
    export type AsObject = {
        url: string,
        digest: string,
        diffId: string,
        mediaType: string,
        size: number,
    }
}

export class DirectContentLayer extends jspb.Message {
    getContent(): Uint8Array | string;
    getContent_asU8(): Uint8Array;
    getContent_asB64(): string;
    setContent(value: Uint8Array | string): DirectContentLayer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DirectContentLayer.AsObject;
    static toObject(includeInstance: boolean, msg: DirectContentLayer): DirectContentLayer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DirectContentLayer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DirectContentLayer;
    static deserializeBinaryFromReader(message: DirectContentLayer, reader: jspb.BinaryReader): DirectContentLayer;
}

export namespace DirectContentLayer {
    export type AsObject = {
        content: Uint8Array | string,
    }
}

export class EnvironmentVariable extends jspb.Message {
    getName(): string;
    setName(value: string): EnvironmentVariable;
    getValue(): string;
    setValue(value: string): EnvironmentVariable;
    getMode(): EnvVarApplication;
    setMode(value: EnvVarApplication): EnvironmentVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EnvironmentVariable.AsObject;
    static toObject(includeInstance: boolean, msg: EnvironmentVariable): EnvironmentVariable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EnvironmentVariable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EnvironmentVariable;
    static deserializeBinaryFromReader(message: EnvironmentVariable, reader: jspb.BinaryReader): EnvironmentVariable;
}

export namespace EnvironmentVariable {
    export type AsObject = {
        name: string,
        value: string,
        mode: EnvVarApplication,
    }
}

export enum EnvVarApplication {
    SET_IF_NOT_EXISTS = 0,
    OVERWRITE = 1,
    APPEND = 2,
    PREPEND = 3,
}
