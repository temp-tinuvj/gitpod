// Copyright (c) 2021 Gitpod GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License-AGPL.txt in the project root for license information.

package workspace

import (
	"fmt"
	"net/http"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

const (
	workspacePortAuthModule = "gitpod.workspace_port_auth"
)

func init() {
	caddy.RegisterModule(PortAuth{})
	httpcaddyfile.RegisterHandlerDirective(workspacePortAuthModule, parseWorkspacePortAuth)
}

// PortAuth implements an HTTP handler that extracts _port_auth_ authentication cookies
type PortAuth struct {
	AuthURL string `json:"authURL,omitempty"`
}

// CaddyModule returns the Caddy module information.
func (PortAuth) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.gitpod_workspace_port_auth",
		New: func() caddy.Module { return new(PortAuth) },
	}
}

// ServeHTTP implements caddyhttp.MiddlewareHandler.
func (m PortAuth) ServeHTTP(w http.ResponseWriter, r *http.Request, next caddyhttp.Handler) error {
	client := http.Client{Timeout: 5 * time.Second}
	req, err := http.NewRequest("GET", m.AuthURL, nil)
	if err != nil {
		return fmt.Errorf("Server Error: cannot download token OTS")
	}

	for _, cookie := range r.Cookies() {
		req.AddCookie(cookie)
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("Server Error: cannot download token OTS")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return caddyhttp.Error(http.StatusUnauthorized, fmt.Errorf("Not Authenticated"))
	}

	return next.ServeHTTP(w, r)
}

// UnmarshalCaddyfile implements Caddyfile.Unmarshaler.
func (m *PortAuth) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	if !d.Next() {
		return d.Err("expected token following filter")
	}

	for d.NextBlock(0) {
		key := d.Val()
		var value string
		d.Args(&value)
		if d.NextArg() {
			return d.ArgErr()
		}

		switch key {
		case "auth_url":
			m.AuthURL = value
		default:
			return d.Errf("unrecognized subdirective '%s'", d.Val())
		}
	}

	if m.AuthURL == "" {
		return fmt.Errorf("Please configure the auth_url subdirective")
	}

	return nil
}

func parseWorkspacePortAuth(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
	m := new(PortAuth)
	err := m.UnmarshalCaddyfile(h.Dispenser)
	if err != nil {
		return nil, err
	}

	return m, nil
}

// Interface guards
var (
	_ caddyhttp.MiddlewareHandler = (*Download)(nil)
	_ caddyfile.Unmarshaler       = (*Download)(nil)
)
