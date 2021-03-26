/**
 * Copyright (c) 2020 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { GitpodHostUrl } from "@gitpod/gitpod-protocol/lib/util/gitpod-host-url";

interface GitpodInstallationInfo {
    apiHostUrl: string;
    dashboardHostUrl: string;
}

const installationInfo: Promise<GitpodInstallationInfo | undefined> = (async function() {
    try {
        const response = await fetch("/_supervisor/v1/info/gitpod", {
            credentials: 'include',
            headers: {
                "Accept": "application/json",
            }
        });
        const text = await response.text();
        return JSON.parse(text);
    } catch (err) {
        console.error("error retrieving GitpodInstallationInfo", err)
        return undefined;
    }
})();

export const workspaceUrl = GitpodHostUrl.fromWorkspaceUrl(window.location.href);

export const apiHostUrl = installationInfo.then(info => new GitpodHostUrl(info?.apiHostUrl));

export const startUrl = installationInfo.then(info => new GitpodHostUrl(info?.apiHostUrl).asStart());