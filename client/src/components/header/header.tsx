import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';
import Icon from '../icon/icon';

const Header = () => {
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
        <Link to='/'>
          <h1 className='header__logo'>
            <Icon padding={0} size='medium' /> reminders
          </h1>
        </Link>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
