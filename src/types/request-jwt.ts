import { Request } from 'express';
import { Jwt } from '@okta/jwt-verifier';

interface RequestJwt extends Request {
  jwt?: Jwt;
}

export default RequestJwt;
