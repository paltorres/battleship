/**
 * Class to auth a user.
 */
import { Router, Request, Response, NextFunction } from 'express';
import UserService from '../../services/users/user-service';
import AuthService from '../../services/auth/auth-service';

import { BaseUser, ValidateUserRequest } from '../../types/user';
import { LoginResponse } from './types';

class AuthController {
  routes = this.router();

  /**
   * Response a JSON object with the token and refreshToken.
   */
  async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body: ValidateUserRequest = req.body;
    const response: LoginResponse = { ok: false, token: null, refreshToken: null };

    const user: BaseUser = await UserService.validateUser(body);

    if (!user) {
      res.status(400).json(response);
      return;
    }

    try {
      [response.token, response.refreshToken] = AuthService.createTokens(user);
    } catch (e) {
      next(e);
      return;
    }

    response.ok = true;

    res.status(200).json(response);
  }

  async me(req: any, res: Response): Promise<void> {
    const token: any = req.headers['x-token'] || '';
    if (token) {
      let user: any;
      try {
        user = AuthService.verifyToken(token).user;
      } catch (err) {
        const refreshToken: any = req.headers['x-refresh-token'];
        const newTokens = await AuthService.refreshTokens(token, refreshToken);
        if (newTokens.token && newTokens.refreshToken) {
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);
        }

        user = newTokens.user;
      }

      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  }

  router() {
    return Router()
      .post('/token', this.getToken)
      .get('/me', this.me);
  }
}

export default new AuthController();
