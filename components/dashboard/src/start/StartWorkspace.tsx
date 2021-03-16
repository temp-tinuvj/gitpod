import React from "react";
import { GitpodService, DisposableCollection, WorkspaceInstance } from "@gitpod/gitpod-protocol";
import { GitpodHostUrl } from "@gitpod/gitpod-protocol/lib/util/gitpod-host-url";
import { StartPage, StartPhase } from "../components/StartPage";

export interface StartWorkspaceProps {
  workspaceId: string;
  gitpodService: GitpodService;
}

export interface StartWorkspaceState {
  contextUrl?: string;
  startedInstanceId?: string;
  workspaceInstance?: WorkspaceInstance;
  error?: StartWorkspaceError;
  ideFrontendFailureCause?: string;
}

export interface StartWorkspaceError {
  message?: string;
  code?: number;
  data?: any;
}

export default class StartWorkspace extends React.Component<StartWorkspaceProps, StartWorkspaceState> {

  constructor(props: StartWorkspaceProps) {
    super(props);
  }

  private readonly toDispose = new DisposableCollection();
  componentWillMount() {
    if (this.runsInIFrame()) {
      const setStateEventListener = (event: MessageEvent) => {
        if (event.data.type === 'setState' && 'state' in event.data && typeof event.data['state'] === 'object') {
          // This seems to only set ideFrontendFailureCause
          alert('setState: ' + JSON.stringify(event, null, 2));
          this.setState(event.data.state);
        }
      }
      window.addEventListener('message', setStateEventListener, false);
      this.toDispose.push({
        dispose: () => window.removeEventListener('message', setStateEventListener)
      });
      // this.setState({ inTheiaAlready: true }); ?
    }

    // this.ensureWorkspaceInfo({ force: false }); ?
    try {
      this.toDispose.push(this.props.gitpodService.registerClient(this));
    } catch (error) {
      this.setState({ error });
    }
    this.startWorkspace();
  }

  componentWillUnmount() {
    this.toDispose.dispose();
  }

  async startWorkspace(restart = false, forceDefaultImage = false) {
    const state = this.state;
    if (state) {
      if (!restart && (state.startedInstanceId /* || state.errorMessage */)) {
        // We stick with a started instance until we're explicitly told not to
        return;
      }
    }

    const { workspaceId } = this.props;
    try {
      const result = await this.props.gitpodService.server.startWorkspace(workspaceId, { forceDefaultImage });
      if (!result) {
        throw new Error("No result!");
      }
      console.log("/start: started workspace instance: " + result.instanceID);
      // redirect to workspaceURL if we are not yet running in an iframe
      if (!this.runsInIFrame() && result.workspaceURL) {
        this.redirectTo(result.workspaceURL);
        return;
      }
      this.setState({ startedInstanceId: result.instanceID /* , errorMessage: undefined, errorCode: undefined, errorData: undefined */ });
      // Explicitly query state to guarantee we get at least one update
      // (needed for already started workspaces, and not hanging in 'Starting ...' for too long)
      this.props.gitpodService.server.getWorkspace(workspaceId).then(ws => {
        if (ws.latestInstance) {
          this.setState({
            contextUrl: ws.workspace.contextURL
          });
          this.onInstanceUpdate(ws.latestInstance);
        }
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  async onInstanceUpdate(workspaceInstance: WorkspaceInstance) {
    const startedInstanceId = this.state?.startedInstanceId;
    if (workspaceInstance.workspaceId !== this.props.workspaceId || startedInstanceId !== workspaceInstance.id) {
      // Can this even happen?
      alert(workspaceInstance.workspaceId + ' ' + this.props.workspaceId + ' / ' + startedInstanceId + ' ' + workspaceInstance.id);
      // sapphire-puma-2d0boxgd amber-marmot-rd2v0rg1 / 577e212c-23fd-4797-a864-9664015bb1a1 b903412b-d194-492a-9c2c-90b8a1f7f6df
      // amber-marmot-rd2v0rg1 amber-marmot-rd2v0rg1 / undefined 577e212c-23fd-4797-a864-9664015bb1a1
      // white-boa-yth74n75 blush-dog-myqe8ip3 / 118d1435-9533-4c7c-8b99-fb5ca6f0f5a4 9a15ecde-29c4-44da-8f42-66c3d33df062
      return;
    }

    // await this.ensureWorkspaceInfo({ force: false });
    await this.ensureWorkspaceAuth(workspaceInstance.id);

    // redirect to workspaceURL if we are not yet running in an iframe
    // it happens this late if we were waiting for a docker build.
    if (!this.runsInIFrame() && workspaceInstance.ideUrl) {
      this.redirectTo(workspaceInstance.ideUrl);
      return;
    }

    if (workspaceInstance.status.phase === 'preparing') {
      this.props.gitpodService.server.watchWorkspaceImageBuildLogs(workspaceInstance.workspaceId);
    }

    this.setState({ workspaceInstance /* , errorMessage: workspaceInstance.status.conditions.failed, errorCode: undefined */ });
  }

  async ensureWorkspaceAuth(instanceID: string) {
    if (!document.cookie.includes(`${instanceID}_owner_`)) {
      const authURL = new GitpodHostUrl(window.location.toString()).asWorkspaceAuth(instanceID);
      const response = await fetch(authURL.toString());
      if (response.redirected) {
        this.redirectTo(response.url);
        return;
      }
      if (!response.ok) {
        // getting workspace auth didn't work as planned - redirect
        this.redirectTo(authURL.asWorkspaceAuth(instanceID, true).toString());
        return;
      }
    }
  }

  redirectTo(url: string) {
    // am I running in Iframe?
    if (this.runsInIFrame()) {
        window.parent.postMessage({ type: 'relocate', url }, '*');
    } else {
        window.location.href = url;
    }
  }

  runsInIFrame() {
    return window.top !== window.self;
  }

  render() {
    let phase = StartPhase.Checking;
    let statusMessage = undefined;

    switch (this.state?.workspaceInstance?.status.phase) {
      // unknown indicates an issue within the system in that it cannot determine the actual phase of
      // a workspace. This phase is usually accompanied by an error.
      case "unknown":
        break;

      // Preparing means that we haven't actually started the workspace instance just yet, but rather
      // are still preparing for launch. This means we're building the Docker image for the workspace.
      case "preparing":
        phase = StartPhase.Building;
        statusMessage = <p className="text-base text-gray-400">Building Image …</p>;
        break;

      // Pending means the workspace does not yet consume resources in the cluster, but rather is looking for
      // some space within the cluster. If for example the cluster needs to scale up to accomodate the
      // workspace, the workspace will be in Pending state until that happened.
      case "pending":
        // if (this.isPrebuilt) {
        //     this.process.stages['restoring-prebuild'].expectedTime = 30 * 1000;
        // } else {
        //     // remove RestoringPrebuild phase to prevent stray stage when not starting from a prebuild
        //     delete this.process.stages['restoring-prebuild'];
        // }
        // this.process.startProcess();
        phase = StartPhase.Preparing;
        statusMessage = <p className="text-base text-gray-400">Allocating Resources …</p>;
        break;

      // Creating means the workspace is currently being created. That includes downloading the images required
      // to run the workspace over the network. The time spent in this phase varies widely and depends on the current
      // network speed, image size and cache states.
      case "creating":
        phase = StartPhase.Preparing;
        statusMessage = <p className="text-base text-gray-400">Pulling Container Image …</p>;
        break;

      // Initializing is the phase in which the workspace is executing the appropriate workspace initializer (e.g. Git
      // clone or backup download). After this phase one can expect the workspace to either be Running or Failed.
      case "initializing":
        // this.process.startProcess();
        // if (this.isPrebuilt) {
        //     // for good measure: try and start the process just in case we missed the previous events. startProcess is idempotent.
        //     this.process.startProcess();
        //     setTimeout(() => {
        //         this.process.setStage('restoring-prebuild');
        //         // tslint:disable-next-line:no-shadowed-variable
        //         const workspaceInstance = this.state.workspaceInstance;
        //         if (workspaceInstance) {
        //             (workspaceInstance.status.phase as (WorkspaceInstanceStatus | 'restoring-prebuild')) = 'restoring-prebuild';
        //             this.setState({ workspaceInstance });
        //         }
        //         // tslint:disable-next-line:align
        //     }, this.process.stages['initializing'].expectedTime);
        //     if (workspaceInstance && workspaceInstance.status.phase === 'initializing'
        //         && this.state.workspaceInstance && this.state.workspaceInstance.status.phase as any === 'restoring-prebuild') {
        //         // we're already in the "fake" restoring-prebuild phase - don't fall back to StartingIDE
        //         return;
        //     }
        // }
        phase = StartPhase.Starting;
        statusMessage = <p className="text-base text-gray-400">Cloning Repository …</p>; // TODO Loading Prebuild ...
        break;

      // Running means the workspace is able to actively perform work, either by serving a user through Theia,
      // or as a headless workspace.
      case "running":
        // if (this.isHeadless) {
        //     this.props.service.server.watchHeadlessWorkspaceLogs(workspaceInstance.workspaceId);
        // }
        phase = StartPhase.Running;
        statusMessage = <p className="text-base text-gray-400">Opening IDE …</p>;
        break;

      // Interrupted is an exceptional state where the container should be running but is temporarily unavailable.
      // When in this state, we expect it to become running or stopping anytime soon.
      case "interrupted":
        phase = StartPhase.Running;
        statusMessage = <p className="text-base text-gray-400">Checking On Workspace …</p>;
        break;

      // Stopping means that the workspace is currently shutting down. It could go to stopped every moment.
      case "stopping":
        statusMessage = <p className="text-base text-gray-400">Stopping …</p>;
        break;

      // Stopped means the workspace ended regularly because it was shut down.
      case "stopped":
        // if (this.isHeadless && this.workspace) {
        //     const contextUrl = this.workspace.contextURL.replace('prebuild/', '')!;
        //     this.redirectTo(new GitpodHostUrl(window.location.toString()).withContext(contextUrl).toString());
        // }
        statusMessage = <p className="text-base text-gray-400">Stopped</p>;
        break;
    }

    // TODO: https://github.com/gitpod-io/gitpod/blob/bd92761635e9021bf8893b5b6850a2f4f202d3f7/components/dashboard/src/components/start-workspace.tsx#L400-L491
    return <StartPage phase={phase}>
      {statusMessage}
      <pre className="mt-10 text-gray-200">startedInstanceId: {JSON.stringify(this.state?.startedInstanceId, null, 2)}</pre>
      <pre className="text-gray-200">contextUrl: {JSON.stringify(this.state?.contextUrl, null, 2)}</pre>
      <pre className="text-gray-200">error: {JSON.stringify(this.state?.error, null, 2)}</pre>
      <pre className="text-gray-200">ideFrontendFailureCause: {JSON.stringify(this.state?.ideFrontendFailureCause, null, 2)}</pre>
    </StartPage>;
  }
}
