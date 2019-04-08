/**
 * Class to auth a user.
 */
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import has from 'ramda/src/has';

import UserService from '../../services/user-service';
import AuthService from '../../services/auth-service';

export interface LoginResponse {
  token: string,
  refreshToken: string,
}


class AuthController {
  routes = this.router();

  /**
   * Response a JSON object with the token and refreshToken.
   */
  async getToken(req: Request, res: Response): Promise<void> {
    let user;

    try {
      user = await UserService.validateUser(prop('body', req));
    } catch(e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json();
      return;
    }

    if (!user) {
      res.status(400).json();
      return;
    }

    let response: LoginResponse = { token: null, refreshToken: null };
    try {
      response = AuthService.createTokens(user);
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json();
      return;
    }

    res.status(200).json(response);
  }

  async validate(req: Request, res: Response): Promise<void> {
    const token = path(['headers', 'x-token'], req);

    if (token) {
      let user;
      try {
        user = AuthService.verifyToken(token).user;
      } catch (e) {
        const refreshToken = path(['headers', 'x-refresh-token'], req);
        const newTokens = await AuthService.refreshTokens(token, refreshToken);

        if (newTokens && has('token', newTokens) && has('refreshToken', newTokens)) {
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);

          user = newTokens.user;
          res.status(200).json(user);
          return;
        } else {
          res.status(400).json({ message: 'token expired or received'});
          return;
        }
      }

      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  }

  router() {
    return Router()
      .post('/token', this.getToken)
      .get('/validate', this.validate);
  }
}

export default new AuthController();
