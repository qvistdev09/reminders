import { Route, Switch } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useHistory } from 'react-router-dom';
import { clientAuth } from '../config/okta-config';

// components
import { Header } from './header';
import { BreadcrumbRow } from './breadcrumb-row';
import SignUp from './sign-up/sign-up';
import Login from './login/login';
import Projects from './projects/projects';
import ProjectPage from './project-page/project-page';

// types
import { OktaAuth } from '@okta/okta-auth-js/lib/types';
import SharedWithYou from './pages/shared-with-you';

const App = () => {
  const history = useHistory();
  const onAuthRequired = () => {
    history.push('/login');
  };
  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };
  return (
    <Security oktaAuth={clientAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={onAuthRequired}>
      <Header />
      <BreadcrumbRow />
      <main className='main'>
        <div className='main__inner'>
          <Switch>
            <Route exact path='/'>
              <p>This is the home route</p>
            </Route>
            <Route exact path='/sign-up' component={SignUp} />
            <Route exact path='/login' component={Login} />
            <SecureRoute exact path='/projects/your-projects' component={Projects} />
            <SecureRoute exact path='/projects/shared-with-you' component={SharedWithYou} />
            <Route path='/projects/:slug' component={ProjectPage} />
            <Route path='/login/callback' component={LoginCallback} />
          </Switch>
        </div>
      </main>
      <footer className='footer'>
        <div className='footer__inner'>
          <p className='footer__text'>by Oscar Lindqvist</p>
        </div>
      </footer>
    </Security>
  );
};

export default App;
