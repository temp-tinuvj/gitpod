/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import EventEmitter from 'events';
import React from 'react';
import { Terminal, ITerminalOptions, ITheme } from 'xterm';
import 'xterm/css/xterm.css';

export interface WorkspaceLogsProps {
  logsEmitter: EventEmitter;
}

export interface WorkspaceLogsState {
}

export default class WorkspaceLogs extends React.Component<WorkspaceLogsProps, WorkspaceLogsState> {
  protected xTermParentRef: React.RefObject<HTMLDivElement>;
  protected terminal: Terminal | undefined;
  
  constructor(props: WorkspaceLogsProps) {
    super(props);
    this.xTermParentRef = React.createRef();
  }

  componentDidMount() {
    const element = this.xTermParentRef.current;
    if (element === null) {
      return;
    }
    const theme: ITheme = {
      // background: '#F5F5F4',
    };
    const options: ITerminalOptions = {
      cursorBlink: false,
      disableStdin: true,
      // fontWeight: 'normal',
      theme,
      fontSize: 14,
    };
    this.terminal = new Terminal(options);
    this.terminal.open(element);
    this.props.logsEmitter.on('logs', logs => {
      if (this.terminal && logs) {
        this.terminal.write(logs);
      }
    });
  }

  componentWillUnmount() {
    if (this.terminal) {
      this.terminal.dispose();
    }
  }

  render() {
    // <pre className="m-6 p-4 h-72 w-11/12 lg:w-3/5 flex-shrink-0 rounded-xl bg-gray-100">
    //   ... logs ...
    // </pre>
    return <div ref={this.xTermParentRef}></div>;
  }
}