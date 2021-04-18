# Copyright (c) 2020 Gitpod GmbH. All rights reserved.
# Licensed under the GNU Affero General Public License (AGPL).
# See License-AGPL.txt in the project root for license information.

FROM caddy:2.4.0-beta.2-builder-alpine AS builder

WORKDIR /build

COPY plugins /build/plugins

RUN xcaddy build \
  --output /usr/bin/caddy \
  --with github.com/caddyserver/format-encoder \
  --with github.com/gitpod-io/gitpod/proxy/plugins/workspace=/build/plugins/workspace

FROM caddy/caddy:2.4.0-beta.2-alpine

# Debug convenience
ENV TERM=xterm
ENV SHELL=/bin/bash

# Update alpine packages
RUN apk upgrade --no-cache

RUN apk add --no-cache \
  bash

COPY conf/Caddyfile /etc/caddy/Caddyfile
COPY conf/vhost.empty /etc/caddy/vhosts/vhost.empty

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
