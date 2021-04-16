import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';

interface AppUser {
  firstName: string;
  lastName: string;
  retrieved: boolean;
}

const useAppUserDetails = (): AppUser => {
  const { authState, oktaAuth } = useOktaAuth();
  const [appUser, setAppUser] = useState({
    firstName: '',
    lastName: '',
    retrieved: false,
  } as AppUser);

  useEffect(() => {
    if (authState.isAuthenticated && !appUser.retrieved) {
      oktaAuth.token.getUserInfo().then(info => {
        const { given_name: firstName, family_name: lastName } = info;
        if (firstName && lastName) {
          setAppUser({
            firstName,
            lastName,
            retrieved: true,
          });
        }
      });
    }
  }, [authState.isAuthenticated, oktaAuth, appUser]);

  return appUser;
};

export { useAppUserDetails };
