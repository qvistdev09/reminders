import { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { getUserDetails, setDetails } from '../reducers/slices/user-details';
import { useAppSelector, useAppDispatch } from './redux-hooks';

interface AppUser {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  retrieved: boolean;
}

const useAppUserDetails = (): AppUser => {
  const dispatch = useAppDispatch();
  const appUser = useAppSelector(getUserDetails);
  const { authState, oktaAuth } = useOktaAuth();

  useEffect(() => {
    if (authState.isAuthenticated && !appUser.retrieved) {
      oktaAuth.token.getUserInfo().then(info => {
        const { given_name: firstName, family_name: lastName, email, sub: uid } = info;
        if (firstName && lastName && email && uid) {
          dispatch(
            setDetails({
              firstName,
              lastName,
              email,
              uid,
            })
          );
        }
      });
    }
  }, [authState.isAuthenticated, oktaAuth, appUser, dispatch]);

  return appUser;
};

export { useAppUserDetails };
