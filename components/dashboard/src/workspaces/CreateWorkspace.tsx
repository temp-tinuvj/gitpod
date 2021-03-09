import { CreateWorkspaceMode, GitpodService, WorkspaceCreationResult } from "@gitpod/gitpod-protocol";
import { ErrorCodes } from "@gitpod/gitpod-protocol/lib/messaging/error";
import React from "react";

function ProgressBar(props: { phase: number, error: boolean }) {
  return <div className="flex space-x-2 mt-8 mb-6">
    <div className={`h-1 w-10 ${props.error ? 'bg-red-600' : ''}`} style={{background: props.error ? undefined : '#9CD714'}}></div>
    <div className="h-1 w-10 bg-gray-200"></div>
    <div className="h-1 w-10 bg-gray-200"></div>
    <div className="h-1 w-10 bg-gray-200"></div>
  </div>;
}

export interface CreateWorkspaceProps {
  contextUrl: string;
  gitpodService: GitpodService;
}

export interface CreateWorkspaceState {
  workspaceCreationResult?: WorkspaceCreationResult;
  createWorkspaceError?: CreateWorkspaceError;
}

export interface CreateWorkspaceError {
  message?: string;
  code?: number;
  data?: any;
}

export class CreateWorkspace extends React.Component<CreateWorkspaceProps, CreateWorkspaceState> {

  constructor(props: CreateWorkspaceProps) {
    super(props);
    window.addEventListener("hashchange", () => { window.location.reload(true); }, false);
    this.createWorkspace();
  }

  async createWorkspace() {
    try {
      const workspaceCreationResult = await this.props.gitpodService.server.createWorkspace({
        contextUrl: this.props.contextUrl,
        mode: CreateWorkspaceMode.SelectIfRunning
      });
      if (workspaceCreationResult.workspaceURL) {
        window.location.href = workspaceCreationResult.workspaceURL;
        return;
      }
      this.setState({ workspaceCreationResult });
    } catch (createWorkspaceError) {
      this.setState({ createWorkspaceError });
    }
  }

  render() {
    const { contextUrl } = this.props;
    let statusMessage = <p className="text-sm text-gray-400">Creating Workspace …</p>;
    const error = this.state?.createWorkspaceError;
    if (error) {
      switch (error.code) {
        case ErrorCodes.CONTEXT_PARSE_ERROR:
          statusMessage = <div className="text-center">
            <p className="text-sm text-red-600">Unrecognized context: '{contextUrl}'</p>
            <p>Learn more about <a className="text-blue-500" href="https://www.gitpod.io/docs/context-urls/">supported context URLs</a></p>
          </div>;
          break;
        case ErrorCodes.NOT_FOUND:
          // TODO: https://github.com/gitpod-io/gitpod/blob/bd92761635e9021bf8893b5b6850a2f4f202d3f7/components/dashboard/src/components/show-not-found-error.tsx#L22
          statusMessage = <div className="text-center">
            <p className="text-sm text-red-600">Not found: {contextUrl}</p>
          </div>;
          break;
        /* TODO:
        if (code === ErrorCodes.SETUP_REQUIRED) {
            return <ApplicationFrame />;
        }
        if (code === ErrorCodes.USER_TERMS_ACCEPTANCE_REQUIRED) {
            return <ApplicationFrame />;
        }
        if (code === ErrorCodes.NOT_AUTHENTICATED) { }
        if (code === ErrorCodes.PLAN_DOES_NOT_ALLOW_PRIVATE_REPOS) {
          return <ShowNoPrivateReposUpgrade />;
        }
        */
        default:
          statusMessage = <p className="text-sm text-red-600">Generic Error</p>;
          break;
      }
    }

    /* TODO:
    if (createWorkspaceResult.createdWorkspaceId) {
        return <StartWorkspace workspaceId={createWorkspaceResult.createdWorkspaceId} service={this.props.service} />;
    }
    if (createWorkspaceResult.existingWorkspaces) {
        return <RunningWorkspaceSelector />;
    }
    if (createWorkspaceResult.runningWorkspacePrebuild) {
        TODO https://github.com/gitpod-io/gitpod/blob/bd92761635e9021bf8893b5b6850a2f4f202d3f7/components/dashboard/src/components/running-prebuild-view.tsx#L29
        Result: {
          "runningWorkspacePrebuild": {
            "prebuildID": "d2b43204-e28d-405d-b93e-11d1b0a148ef",
            "workspaceID": "amber-crow-qhb9ywsz",
            "starting": "running",
            "sameCluster": false
          }
        }
        return <RunningPrebuildView />
    }*/

    return <div className="h-screen flex">
      <div className="w-full mt-40 md:mt-60 flex flex-col items-center">
        <img src="/gitpod.svg" className="h-16 flex-shrink-0" />
        <h3 className="mt-4">Peparing Workspace</h3>
        <ProgressBar phase={0} error={!!error}/>
        {statusMessage}
        <div className="m-6 p-4 h-60 w-11/12 lg:w-3/5 flex-shrink-0 rounded-lg" style={{ color: '#8E8787', background: '#ECE7E5' }}>
          Logs
        </div>
        <pre className="mt-10">Result: {JSON.stringify(this.state?.workspaceCreationResult, null, 2)}</pre>
        <pre>Error: {JSON.stringify(this.state?.createWorkspaceError, null, 2)}</pre>
      </div>
    </div>;
  }

}