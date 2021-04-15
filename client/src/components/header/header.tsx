import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';

// components
import Icon from '../icon/icon';
import UserIcon from '../user-icon/user-icon';

// redux
import { useAppDispatch } from '../../hooks/redux-hooks';
import { useAppSelector } from '../../hooks/redux-hooks';
import { setName } from '../../reducers/slices/user-details';
import { getUserDetails } from '../../reducers/slices/user-details';

const Header = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(getUserDetails);
  const { authState, oktaAuth } = useOktaAuth();
  const history = useHistory();

  const authed = authState.isAuthenticated;

  useEffect(() => {
    if (authState.isAuthenticated && !userDetails.retrieved) {
      oktaAuth.token.getUserInfo().then(info => {
        const { given_name: firstName, family_name: lastName } = info;
        if (firstName && lastName) {
          dispatch(setName({ firstName, lastName }));
        }
      });
    }
  }, [authState.isAuthenticated, oktaAuth, dispatch, userDetails.retrieved]);

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
          {userDetails.retrieved && (
            <UserIcon firstName={userDetails.firstName} lastName={userDetails.lastName} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
