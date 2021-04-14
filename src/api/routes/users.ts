import express, { NextFunction, Response } from 'express';
import { postUserToOkta } from '../services/user-service';
import { validateSignUpFields } from '../validation-schemas/sign-up-validation';
import { ControlledError } from '../../classes/controlled-error';
import RequestJwt from '../../types/request-jwt';
import axios, { AxiosError } from 'axios';

const router = express.Router();

router.post('/', (req: RequestJwt, res: Response, next: NextFunction) => {
  if (!req.body.newUser) {
    return next(new ControlledError('Missing fields', 400));
  }
  const validationResult = validateSignUpFields(req.body.newUser);
  if (validationResult instanceof ControlledError) {
    return next(validationResult);
  }
  postUserToOkta(validationResult)
    .then(() => res.status(201).end())
    .catch((err: AxiosError) => {
      if (err.response?.data && err.response.data.errorSummary) {
        return next(new ControlledError(err.response.data.errorSummary, 400));
      }
      next(err);
    });
});

export default router;
