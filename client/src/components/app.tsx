import { Redirect, Route, Switch } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useHistory } from 'react-router-dom';
import { clientAuth } from '../config/okta-config';

// components
import { Header } from './header';
import { BreadcrumbRow } from './breadcrumb-row';
import { Projects } from './pages/projects';
import SignUp from './sign-up';
import Login from './login';
import { ProjectAccessRouter } from './project-access-router';

// types
import { OktaAuth } from '@okta/okta-auth-js/lib/types';
import SharedWithYou from './pages/shared-with-you';
import { Home } from './home';
import { Flex } from './presentational/containers/flex';
import { Text } from './presentational/texts/text';
import Icon from './icon/icon';

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
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/sign-up' component={SignUp} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/projects' component={() => <Redirect to='/projects/your-projects' />} />
          <SecureRoute exact path='/projects/your-projects' component={Projects} />
          <SecureRoute exact path='/projects/shared-with-you' component={SharedWithYou} />
          <Route path='/projects/:slug' component={ProjectAccessRouter} />
          <Route path='/login/callback' component={LoginCallback} />
        </Switch>
      </main>
      <footer>
        <Flex justify='center' yPadding={1} childrenGap='small'>
          <Text size='small' weight='thin'>
            by Oscar Lindqvist
          </Text>
          <Icon icon='heart' color='semiDark' size='tiny' />
          <a href='https://github.com/qvistdev09' className='links__external'>
            <Text weight='strong'>my Github</Text>
          </a>
        </Flex>
      </footer>
    </Security>
  );
};

export default App;
