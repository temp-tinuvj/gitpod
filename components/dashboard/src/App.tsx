import React, { Suspense, useContext } from 'react';
import Menu from './components/Menu';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Workspaces } from './workspaces/Workspaces';
import { CreateWorkspace } from './workspaces/CreateWorkspace';
import { ServiceContext } from './service/service';
import { Login } from './Login';

const Notifications = React.lazy(() => import('./account/Notifications'));
const Profile = React.lazy(() => import('./account/Profile'));
const Subscriptions = React.lazy(() => import('./account/Subscriptions'));
const DefaultIDE = React.lazy(() => import('./settings/DefaultIDE'));
const EnvVars = React.lazy(() => import('./settings/EnvVars'));
const FeaturePreview = React.lazy(() => import('./settings/FeaturePreview'));
const GitIntegration = React.lazy(() => import('./settings/GitIntegration'));

function App() {
  const ctx = useContext(ServiceContext);
  if (!ctx.user) {
    return (
      <Login/>
    );
  }
  const contextUrl = window.location.hash.replace(/^[#/]+/, '');
  if (contextUrl !== '') {
    return (
      <CreateWorkspace contextUrl={contextUrl} gitpodService={ctx.service}/>
    );
  }
  return (
    <BrowserRouter>
        <div className="container">
          <Menu left={[
            {
              title: 'Workspaces',
              link: '/'
            },
            {
              title: 'Settings',
              link: '/profile'
            },
          ]}
            right={[
            {
              title: 'Docs',
              link: 'https://www.gitpod.io/docs/',
            },
            {
              title: 'Community',
              link: 'https://community.gitpod.io/',
            }
          ]} />
          <Suspense fallback={<div></div>}>
            <Switch>
              <Route path="/" exact render={
                () => <Workspaces gitpodService={ctx.service}/>} />
              <Route path="/profile" exact component={Profile} />
              <Route path="/notifications" exact component={Notifications} />
              <Route path="/subscriptions" exact component={Subscriptions} />
              <Route path="/env-vars" exact component={EnvVars} />
              <Route path="/git-integration" exact component={GitIntegration} />
              <Route path="/feature-preview" exact component={FeaturePreview} />
              <Route path="/default-ide" exact component={DefaultIDE} />
            </Switch>
          </Suspense>
        </div>
    </BrowserRouter>
  );
}

export default App;
