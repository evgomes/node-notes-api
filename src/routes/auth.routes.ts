import { Router, Request, Response } from 'express';
import validateSchema from '../middlewares/schema-validator';
import AuthController from '../controllers/auth.controller';
import User from '../models/user.model';
import LoginResource from '../resources/auth/login-resource';

const router = Router();

router.post(
  '/',
  [validateSchema(User.validate)],
  async (req: Request, res: Response) => {
    const controller = new AuthController();
    const response = await controller.authenticate(
      new LoginResource(req.body.email, req.body.password),
    );
    const statusCode = response.success ? 200 : 400;
    return res.status(statusCode).send(response);
  },
);

export default router;
