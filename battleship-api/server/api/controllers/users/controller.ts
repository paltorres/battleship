/**
 * User controller.
 */
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

// import log from '../../../common/logger';

import UserService from '../../services/users/user-service';
import { BaseUser } from '../../types/user';

class UserController {
  routes = this.router();

  async get(req: Request, res: Response): Promise<void> {
    let user: any;
    try {
      user = await UserService.getById(req.params.userId);
    } catch (e) {
      // log.error(e);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      return;
    }

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    res.status(HttpStatus.OK).json(user);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user: BaseUser = await UserService.create(req.body);

      if (!user) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'username or password invalid' });
        return;
      }

      res.status(HttpStatus.CREATED).json(user);
    } catch (e) {
      // log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json();
    }
  }

  router() {
    return Router()
      .post('/', this.create)
      .get('/:userId', this.get);
  }
}

export default new UserController();
