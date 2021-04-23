import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      jwt: {
        claims: {
          uid: string;
        };
      };
    }
  }
}
