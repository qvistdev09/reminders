import { NextFunction, Response } from 'express';
import { Jwt } from '@okta/jwt-verifier';
import RequestJwt from '../types/request-jwt';
import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';

const authAppend = (req: RequestJwt, res: Response, next: NextFunction) => {
  const accessToken = extractAccessToken(req.headers.authorization);

  if (!accessToken) {
    return next();
  }

  return appJwtVerifier
    .verifyAccessToken(accessToken, aud)
    .then((jwt: Jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch(() => {
      next();
    });
};

export { authAppend };
