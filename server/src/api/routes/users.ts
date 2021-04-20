import { AxiosError } from 'axios';
import express, { NextFunction, Request, Response } from 'express';
import { ControlledError } from '../../classes/controlled-error';
import { authRequired } from '../../middleware/auth-required';
import { getAllAppUsers, postUserToOkta } from '../services/user-service';
import { validateSignUpFields } from '../validation/sign-up-validation';

const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
      if (err.response?.data?.errorSummary) {
        return next(new ControlledError(err.response.data.errorSummary, 400));
      }
      next(err);
    });
});

router.get('/', authRequired, (req: Request, res: Response, next: NextFunction) => {
  getAllAppUsers()
    .then(userObjects => res.json(userObjects))
    .catch(() => next(new ControlledError('Could not get users', 500)));
});

export default router;
