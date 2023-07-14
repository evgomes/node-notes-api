import {
  Body,
  Controller,
  Example,
  Post,
  Route,
  Tags,
  Response,
  SuccessResponse,
} from 'tsoa';
import LoginResource from '../resources/auth/login-resource';
import TokenResource from '../resources/auth/token-resource';

import User from '../models/user.model';
import { hashMatches } from '../services/hash.service';

@Route('/api/login')
@Tags('Auth')
export default class AuthController extends Controller {
  /**
   * Authenticates an user using an email and password.
   * @param payload Payload containing the user's email and password.
   * @returns A JSON web token for the authenticated user.
   */
  @Post()
  @Example<LoginResource>({ email: 'example@email.com', password: '123456' })
  @SuccessResponse(200, 'Success')
  @Response<TokenResource>(400, 'Bad Request', {
    success: false,
    message: 'Invalid login or  password.',
    token: undefined,
  })
  public async authenticate(
    @Body() payload: LoginResource,
  ): Promise<TokenResource> {
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return new TokenResource(false, undefined, 'Invalid email or password.');
    }

    const passwordMatches = await hashMatches(payload.password, user.password);
    if (!passwordMatches) {
      return new TokenResource(false, undefined, 'Invalid email or password.');
    }

    const token = user.generateAuthToken();
    return new TokenResource(true, token, undefined);
  }
}
