import { Jwt } from '@okta/jwt-verifier';
import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';

const authSocket = (authHeader: any): Promise<Jwt> => {
  return new Promise((resolve, reject) => {
    const accessToken = extractAccessToken(authHeader);
    if (!accessToken) {
      return reject('nah');
    }
    appJwtVerifier
      .verifyAccessToken(accessToken, aud)
      .then(jwt => resolve(jwt))
      .catch(() => reject());
  });
};

export { authSocket };
