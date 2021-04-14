import Joi from 'joi';
import { ControlledError } from '../../classes/controlled-error';

interface ClientUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  securityQuestion: string;
  securityAnswer: string;
}

const signUpSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'se'] } })
    .required(),
  password: Joi.string().required(),
  passwordRepeat: Joi.ref('password'),
  securityQuestion: Joi.string().required(),
  securityAnswer: Joi.string().required(),
});

const validateSignUpFields = (
  userFields: unknown
): ClientUserProfile | ControlledError => {
  const validationResult = signUpSchema.validate(userFields);
  if (validationResult.error) {
    return new ControlledError('Invalid fields', 400);
  }
  return userFields as ClientUserProfile;
};

export { validateSignUpFields, ClientUserProfile };
