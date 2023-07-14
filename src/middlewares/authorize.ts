import { Request, Response, NextFunction } from 'express';
import ErrorResource from '../resources/shared/error-resource';

import tokenConfig from '../config/token.json';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Extended request interface that exposes properties for the logged in user.
 */
export interface AuthorizedRequest extends Request {
  userId?: number;
  userEmail?: string;
}

/**
 * Extensed JSON Web Token payload interface that exposes user properties.
 */
export interface UserJwtPayload extends JwtPayload {
  id: number;
  email: string;
}

/**
 * Middleware that verifies if a user is authorized to access a given resource.
 * @returns middleware function that applies authorization.
 */
export function authorize() {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).send(new ErrorResource(['Access denied.']));
    }

    try {
      const token = header.replace('Bearer ', '');

      const privateKey =
        process.env.JWT_PRIVATE_KEY || tokenConfig.jwtPrivateKey;
      const decodedToken = jwt.verify(token, privateKey) as UserJwtPayload;

      (req as AuthorizedRequest).userId = decodedToken.id;
      (req as AuthorizedRequest).userEmail = decodedToken.email;

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send(new ErrorResource(['Access denied.']));
    }
  };
}
