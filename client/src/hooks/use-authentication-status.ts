import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const useAuthenticationStatus = () => {
  const { authState } = useOktaAuth();
  const [authenticated, setIsAuthenticated] = useState(authState.isAuthenticated === true);

  useEffect(() => {
    setIsAuthenticated(authState.isAuthenticated === true);
  }, [authState.isAuthenticated]);

  return {
    authenticated,
  };
};

export { useAuthenticationStatus };
