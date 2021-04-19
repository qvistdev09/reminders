import { NextFunction, Response } from 'express';
import { Jwt } from '@okta/jwt-verifier';
import RequestJwt from '../types/request-jwt';
import { ControlledError } from '../classes/controlled-error';
import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';

const authRequired = (req: RequestJwt, res: Response, next: NextFunction) => {
  const accessToken = extractAccessToken(req.headers.authorization);

  if (!accessToken) {
    const noCredentialsError = new ControlledError('Missing credentials', 401);
    return next(noCredentialsError);
  }

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
