import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';
import { useAppUserDetails } from '../../hooks/use-app-user-details';
import { useAuthenticationStatus } from '../../hooks/use-authentication-status';

// components
import Icon from '../icon/icon';
import UserIcon from '../user-icon/user-icon';
import HeaderNavItem from './elements/header-nav-item';

const Header = () => {
  const { authenticated } = useAuthenticationStatus();
  const appUserDetails = useAppUserDetails();
  const { oktaAuth } = useOktaAuth();
  const history = useHistory();

  const loginOrLogout = authenticated ? (
    <button className='header__btn' onClick={() => oktaAuth.signOut()}>
      Log out
    </button>
  ) : (
    <button className='header__btn' onClick={() => history.push('/login')}>
      Log in
    </button>
  );

  return (
    <header className='header'>
      <nav className='header__inner'>
        <Link to='/' className='header__logo-container'>
          <h1 className='header__logo'>
            <Icon padding={0} size='large' /> reminders
          </h1>
        </Link>
        <div className='header__nav-items-container'>
          {authenticated && (
            <HeaderNavItem
              label='Your projects'
              icon={<Icon icon='grid' color='white' size='small' padding={0} />}
              to='/projects/your-projects'
            />
          )}
          {authenticated && (
            <HeaderNavItem
              label='Shared with you'
              icon={<Icon icon='shared' color='white' size='small' padding={0} />}
              to='/projects/shared-with-you'
            />
          )}
        </div>
        <div className='header__login'>
          {!authenticated && (
            <button className='header__btn header__btn--action' onClick={() => history.push('/sign-up')}>
              Sign up
            </button>
          )}
          {loginOrLogout}
          {appUserDetails.retrieved && (
            <UserIcon firstName={appUserDetails.firstName} lastName={appUserDetails.lastName} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
