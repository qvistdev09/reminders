import { NextFunction, Response } from 'express';
import { Jwt } from '@okta/jwt-verifier';
import RequestJwt from 'src/types/request-jwt';
import { ControlledError } from 'src/classes/controlled-error';
import appJwtVerifier from 'src/config/okta-config';

const authRequired = (req: RequestJwt, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);
  const aud = 'api://default';

  if (!match) {
    const noCredentialsError = new ControlledError('Missing credentials', 401);
    return next(noCredentialsError);
  }

  const accessToken = match[1];

  return appJwtVerifier
    .verifyAccessToken(accessToken, aud)
    .then((jwt: Jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch(() => {
      const invalidTokenError = new ControlledError('Invalid token', 401);
      next(invalidTokenError);
    });
};

export { authRequired };
