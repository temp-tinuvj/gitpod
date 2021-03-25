/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import * as images from './images';
import { gitpodHostUrl } from "./service/service";


function iconForAuthProvider(type: string) {
    switch (type) {
        case "GitHub":
            return images.github
        case "GitLab":
            return images.gitlab
        case "Bitbucket":
            return images.bitbucket
        default:
            break;
    }
}

function simplifyProviderName(host: string) {
    switch (host) {
        case "github.com":
            return "GitHub"
        case "gitlab.com":
            return "GitLab"
        case "bitbucket.org":
            return "Bitbucket"
        default:
            return host;
    }
}

async function openAuthorizeWindow({ host, scopes, onSuccess, onError }: { host: string, scopes?: string[], onSuccess?: () => void, onError?: () => void }) {
    const returnTo = gitpodHostUrl.with({ pathname: 'login-success' }).toString();
    const url = gitpodHostUrl.withApi({
        pathname: '/authorize',
        search: `returnTo=${encodeURIComponent(returnTo)}&host=${host}&override=true&scopes=${(scopes || []).join(',')}`
    }).toString();
    const newWindow = window.open(url, "gitpod-connect");
    if (!newWindow) {
        console.log(`Failed to open the authorize window for ${host}`);
        onError && onError();
        throw new Error("failed");
    }

    const eventListener = (event: MessageEvent) => {
        // todo: check event.origin

        if (event.data === "auth-success") {
            window.removeEventListener("message", eventListener);

            if (event.source && "close" in event.source && event.source.close) {
                console.log(`try to close window`);
                event.source.close();
            } else {
                // todo: add a button to the /login-success page to close, if this should not work as expected
            }
            onSuccess && onSuccess();
        }
    };
    window.addEventListener("message", eventListener);

    for (let i = 0; i < 100; i ++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (newWindow.closed) {
            onError && onError();
            throw new Error("closed");
        }
        try {
            if (newWindow.document.location.href.toString().includes("login-success")) {
                onSuccess && onSuccess();
                return;
            }
        } catch (error) {
            continue; // cross-origin exception
        }
        if (newWindow.document.location.href.toString().includes("error")) {
            newWindow.close();
            onError && onError();
            throw new Error("unknown");
        }
    }
    newWindow.close();
    onError && onError();
    throw new Error("timeout");
}

export { iconForAuthProvider, simplifyProviderName, openAuthorizeWindow }