import { Row } from './presentational/containers/row';
import { InnerMaxWidth } from './presentational/containers/inner-max-width';
import { Logo } from './presentational/logo/logo';
import { NavItem } from './presentational/nav-item/nav-item';
import Icon from './icon/icon';
import { useAuthenticationStatus } from '../hooks/use-authentication-status';
import { Button } from './presentational/button/button';
import { useHistory } from 'react-router';
import { useOktaAuth } from '@okta/okta-react';
import { useAppUserDetails } from '../hooks/use-app-user-details';
import UserIcon from './presentational/user-icon/user-icon';

export const Header = () => {
  const history = useHistory();
  const appUser = useAppUserDetails();
  const { oktaAuth } = useOktaAuth();
  const { authenticated } = useAuthenticationStatus();

  const signUpAction = () => {
    history.push('/sign/up');
  };

  const loginOrLogout = authenticated ? (
    <Button label='Sign out' onClick={() => oktaAuth.signOut()} />
  ) : (
    <Button label='Log in' onClick={() => history.push('/login')} />
  );

  return (
    <header>
      <Row justify='centered' bg='brightBg' minHeight='header' borders={['bottom']}>
        <InnerMaxWidth isNav={true}>
          <Logo />
          <Row justify='start' expand={true}>
            {authenticated && (
              <>
                <NavItem
                  label='Your projects'
                  to='/projects/your-projects'
                  icon={<Icon icon='grid' color='primary' size='small' padding={0} />}
                />
                <NavItem
                  label='Shared with you'
                  to='/projects/shared-with-you'
                  icon={<Icon icon='shared' color='primary' size='small' padding={0} />}
                />
              </>
            )}
          </Row>
          <Row justify='start'>
            {!authenticated && <Button onClick={signUpAction} label='Sign up' btnStyle='action' />}
            {loginOrLogout}
            {appUser.retrieved && <UserIcon firstName={appUser.firstName} lastName={appUser.lastName} />}
          </Row>
        </InnerMaxWidth>
      </Row>
    </header>
  );
};
