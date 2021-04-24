import { Flex } from './presentational/containers/flex';
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
    history.push('/sign-up');
  };

  const loginOrLogout = authenticated ? (
    <Button label='Sign out' onClick={() => oktaAuth.signOut()} />
  ) : (
    <Button label='Log in' onClick={() => history.push('/login')} />
  );

  return (
    <header>
      <Flex justify='center' bg='brightBg' minHeight='header' borders={['bottom']} align='stretch'>
        <Flex isNav={true} align='stretch' maxWidth='appMaxWidth' flex={1} xPadding={1}>
          <Logo />
          <Flex justify='start' flex={1} align='stretch'>
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
          </Flex>
          <Flex justify='start' flex={0}>
            {!authenticated && <Button onClick={signUpAction} label='Sign up' btnStyle='action' />}
            {loginOrLogout}
            {appUser.retrieved && <UserIcon firstName={appUser.firstName} lastName={appUser.lastName} />}
          </Flex>
        </Flex>
      </Flex>
    </header>
  );
};
