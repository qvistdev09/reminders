import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const useAccessToken = (): string | null => {
  const { authState } = useOktaAuth();
  const [token, setToken] = useState(null as string | null);

  useEffect(() => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      setToken(accessToken);
    }
  }, [authState.accessToken]);
  return token;
};

export { useAccessToken };
