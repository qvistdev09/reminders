import { Route, Switch } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useHistory } from 'react-router-dom';
import { clientAuth } from '../../config/okta-config';

// components
import Header from '../header/header';
import SignUp from '../sign-up/sign-up';
import Login from '../login/login';

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
      <main className='main'>
        <div className='main__inner'>
          <Switch>
            <Route exact path='/'>
              <p>{process.env.NODE_ENV}</p>
            </Route>
            <Route exact path='/sign-up'>
              <SignUp />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
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
