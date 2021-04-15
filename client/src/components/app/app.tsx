import { Route, Switch } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useHistory } from 'react-router-dom';
import { clientAuth } from '../../config/okta-config';

// components
import Header from '../header/header';
import SignUp from '../sign-up/sign-up';
import Login from '../login/login';
import Breadcrumb from '../breadcrumb/breadcrumb';
import Projects from '../projects/projects';

// types
import { OktaAuth } from '@okta/okta-auth-js/lib/types';

const App = () => {
  const history = useHistory();
  const onAuthRequired = () => {
    history.push('/login');
  };
  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };
  return (
    <Security
      oktaAuth={clientAuth}
      restoreOriginalUri={restoreOriginalUri}
      onAuthRequired={onAuthRequired}
    >
      <Header />
      <Breadcrumb />
      <main className='main'>
        <div className='main__inner'>
          <Switch>
            <Route exact path='/'>
              <p>This is the Home route - yet to be filled with content!</p>
            </Route>
            <Route exact path='/sign-up' component={SignUp} />
            <Route exact path='/login' component={Login} />
            <SecureRoute exact path='/projects' component={Projects} />
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
