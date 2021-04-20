import { NextFunction, Request, Response } from 'express';
import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';

const authAppend = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = extractAccessToken(req.headers.authorization);

  if (!accessToken) {
    return next();
  }

  return appJwtVerifier
    .verifyAccessToken(accessToken, aud)
    .then((jwt: any) => {
      req.jwt = jwt;
      next();
    })
    .catch(() => {
      next();
    });
};

export { authAppend };
