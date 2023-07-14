import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import ErrorResource from '../resources/shared/error-resource';

/**
 * Produces an array of error messages from a schema validation result.
 * @param error validation error to retrieve error messages.
 * @returns array containing error messages.
 */
function getErrorMessages(error: Joi.ValidationError): string[] {
  const errors = [];

  if (!error.details) {
    errors.push(error.message);
    return errors;
  }

  for (const entry of error.details) {
    errors.push(entry.message);
  }

  return errors;
}

/**
 * Middleware that applies schema validation using Joi. If there are validation errors in the request body, the application returns an error resource.
 * @param validator schema validation function.
 * @returns middleware function that applies schema validation before calling the route logic.
 */
function validateSchema(validator: (model: any) => Joi.ValidationResult<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = validator(req.body);
    if (error) {
      const resource = new ErrorResource(getErrorMessages(error));
      return res.status(400).send(resource);
    }

    next();
  };
}

export default validateSchema;
