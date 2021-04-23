/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var provider_pb = require('./provider_pb.js');
var imagespec_pb = require('./imagespec_pb.js');
var content$service$api_initializer_pb = require('@gitpod/content-service/lib');

function serialize_registryfacade_GetImageSpecRequest(arg) {
  if (!(arg instanceof provider_pb.GetImageSpecRequest)) {
    throw new Error('Expected argument of type registryfacade.GetImageSpecRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_registryfacade_GetImageSpecRequest(buffer_arg) {
  return provider_pb.GetImageSpecRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_registryfacade_GetImageSpecResponse(arg) {
  if (!(arg instanceof provider_pb.GetImageSpecResponse)) {
    throw new Error('Expected argument of type registryfacade.GetImageSpecResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_registryfacade_GetImageSpecResponse(buffer_arg) {
  return provider_pb.GetImageSpecResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_registryfacade_GetOfflineImageSpecRequest(arg) {
  if (!(arg instanceof provider_pb.GetOfflineImageSpecRequest)) {
    throw new Error('Expected argument of type registryfacade.GetOfflineImageSpecRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_registryfacade_GetOfflineImageSpecRequest(buffer_arg) {
  return provider_pb.GetOfflineImageSpecRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_registryfacade_GetWorkspaceContextRequest(arg) {
  if (!(arg instanceof provider_pb.GetWorkspaceContextRequest)) {
    throw new Error('Expected argument of type registryfacade.GetWorkspaceContextRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_registryfacade_GetWorkspaceContextRequest(buffer_arg) {
  return provider_pb.GetWorkspaceContextRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_registryfacade_GetWorkspaceContextResponse(arg) {
  if (!(arg instanceof provider_pb.GetWorkspaceContextResponse)) {
    throw new Error('Expected argument of type registryfacade.GetWorkspaceContextResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_registryfacade_GetWorkspaceContextResponse(buffer_arg) {
  return provider_pb.GetWorkspaceContextResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SpecProviderService = exports.SpecProviderService = {
  // GetImageSpec provides the image spec for a particular ID. What the ID referes to is specific to
// the spec provider. For example, in case of ws-manager providing the spec, the ID is a
// workspace instance ID.
getImageSpec: {
    path: '/registryfacade.SpecProvider/GetImageSpec',
    requestStream: false,
    responseStream: false,
    requestType: provider_pb.GetImageSpecRequest,
    responseType: provider_pb.GetImageSpecResponse,
    requestSerialize: serialize_registryfacade_GetImageSpecRequest,
    requestDeserialize: deserialize_registryfacade_GetImageSpecRequest,
    responseSerialize: serialize_registryfacade_GetImageSpecResponse,
    responseDeserialize: deserialize_registryfacade_GetImageSpecResponse,
  },
  getOfflineImageSpec: {
    path: '/registryfacade.SpecProvider/GetOfflineImageSpec',
    requestStream: false,
    responseStream: false,
    requestType: provider_pb.GetOfflineImageSpecRequest,
    responseType: provider_pb.GetImageSpecResponse,
    requestSerialize: serialize_registryfacade_GetOfflineImageSpecRequest,
    requestDeserialize: deserialize_registryfacade_GetOfflineImageSpecRequest,
    responseSerialize: serialize_registryfacade_GetImageSpecResponse,
    responseDeserialize: deserialize_registryfacade_GetImageSpecResponse,
  },
};

exports.SpecProviderClient = grpc.makeGenericClientConstructor(SpecProviderService);
var ContextProviderService = exports.ContextProviderService = {
  getWorkspaceContext: {
    path: '/registryfacade.ContextProvider/GetWorkspaceContext',
    requestStream: false,
    responseStream: false,
    requestType: provider_pb.GetWorkspaceContextRequest,
    responseType: provider_pb.GetWorkspaceContextResponse,
    requestSerialize: serialize_registryfacade_GetWorkspaceContextRequest,
    requestDeserialize: deserialize_registryfacade_GetWorkspaceContextRequest,
    responseSerialize: serialize_registryfacade_GetWorkspaceContextResponse,
    responseDeserialize: deserialize_registryfacade_GetWorkspaceContextResponse,
  },
};

exports.ContextProviderClient = grpc.makeGenericClientConstructor(ContextProviderService);
