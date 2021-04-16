import express, { NextFunction, Response } from 'express';
import { authRequired } from 'src/middleware/auth-required';
import { postUserToOkta, getAllAppUsers } from 'src/api/services/user-service';
import { validateSignUpFields } from 'src/api/validation-schemas/sign-up-validation';
import { ControlledError } from 'src/classes/controlled-error';
import RequestJwt from 'src/types/request-jwt';
import { AxiosError } from 'axios';

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

router.get('/', authRequired, (req: RequestJwt, res: Response, next: NextFunction) => {
  getAllAppUsers()
    .then(userObjects => res.json(userObjects))
    .catch(() => next(new ControlledError('Could not get users', 500)));
});

export default router;
