import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';
import { useAppUserDetails } from '../../hooks/use-app-user-details';

// components
import Icon from '../icon/icon';
import UserIcon from '../user-icon/user-icon';
import HeaderNavItem from './elements/header-nav-item';

const Header = () => {
  const appUserDetails = useAppUserDetails();
  const { authState, oktaAuth } = useOktaAuth();
  const history = useHistory();

  const authed = authState.isAuthenticated;

  const loginOrLogout = authed ? (
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
          {authed && (
            <HeaderNavItem
              label='Projects'
              icon={<Icon icon='grid' color='white' size='small' padding={0} />}
              to='/projects'
            />
          )}
        </div>
        <div className='header__login'>
          {!authed && (
            <button
              className='header__btn header__btn--action'
              onClick={() => history.push('/sign-up')}
            >
              Sign up
            </button>
          )}
          {loginOrLogout}
          {appUserDetails.retrieved && (
            <UserIcon
              firstName={appUserDetails.firstName}
              lastName={appUserDetails.lastName}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
