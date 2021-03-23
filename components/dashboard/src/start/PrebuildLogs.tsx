/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import EventEmitter from "events";
import { useEffect } from "react";
import { RunningWorkspacePrebuildStarting } from "@gitpod/gitpod-protocol";
import { getGitpodService } from "../service/service";
import WorkspaceLogs from "./WorkspaceLogs";

export interface PrebuildLogsProps {
  prebuildingWorkspaceId: string;
  justStarting: RunningWorkspacePrebuildStarting;
  onIgnorePrebuild: () => void;
  // onWatchPrebuild: () => void;
}

export default function PrebuildLogs (props: PrebuildLogsProps) {
  const logsEmitter = new EventEmitter();
  const service = getGitpodService();

  useEffect(() => {
    function watchPrebuild() {
      service.server.watchHeadlessWorkspaceLogs(props.prebuildingWorkspaceId);
      // props.onWatchPrebuild();
    }
    watchPrebuild();

    const toDispose = service.registerClient({
      // notifyDidOpenConnection: () => watchPrebuild(),
      onHeadlessWorkspaceLogs: event => {
        if (event.workspaceID !== props.prebuildingWorkspaceId) {
          return;
        }
        logsEmitter.emit('logs', event.text);
      },
    });

    return function cleanup() {
      toDispose.dispose();
    };
  });

  return <>
    <button onClick={props.onIgnorePrebuild}>Skip Prebuild</button>
    <WorkspaceLogs logsEmitter={logsEmitter} />
  </>;
}