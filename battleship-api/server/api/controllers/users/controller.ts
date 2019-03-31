/**
 * User controller.
 */
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

// import log from '../../../common/logger';

import UserService from '../../services/user-service';

class UserController {
  routes = this.router();

  async get(req: Request, res: Response): Promise<void> {
    let user: any;
    try {
      user = await UserService.getById(req.params.userId);
    } catch (e) {
      console.log(e);
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
    const { user, errors } = await UserService.create(req.body);

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    try {
      await user.save();
    } catch(e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json();
      return;
    }

    res.status(HttpStatus.CREATED).json(user);
  }

  router() {
    return Router()
      .post('/', this.create)
      .get('/:userId', this.get);
  }
}

export default new UserController();
