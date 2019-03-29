/**
 * Games controller.
 */
import { NextFunction, Request, Response, Router } from 'express';
import get from 'lodash.get';
import * as HttpStatus from 'http-status-codes';

import log from '../../../common/logger';
import gameService from '../../services/game/game-service';

class GamesController {
  routes = this.router();

  async get(req: any, res: Response, next: NextFunction) {
    const userId = get(req, 'user.id', null);

    if (!userId) {
      res.status(HttpStatus.FORBIDDEN).json();
      return;
    }

    const gameId = get(req, 'params.gameId', null);

    let game;
    try {
      game = await gameService.get({ id: gameId, userId });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }

    if (game) {
      res.status(HttpStatus.OK).json(game);
    } else {
      res.status(HttpStatus.NOT_FOUND).json();
    }
  }

  async create(req: any, res: Response, next: NextFunction) {
    const title = get(req, 'body.title', null);
    const userId = get(req, 'user.id', null);

    if (!userId) {
      // 400
      next(new Error('The user is not present'));
      return;
    }

    try {
      const game = await gameService.create({ title, userId });
      res.status(HttpStatus.CREATED).json(game);
    } catch (e) {
      log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }
  }

  async addOpponent(req: any, res: Response, next: NextFunction) {
    const userId = get(req, 'user.id', null);

    if (!userId) {
      next(new Error('The user is not present'));
    }

    const gameId = get(req, 'params.gameId', null);

    try {
      // const game = await gameService.join({ id: gameId, opponent: userId });
      const game = {};
      res.status(HttpStatus.CREATED).json(game);
    } catch (e) {
      log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }
  }

  router() {
    return Router().post('/', this.create)
      .get('/:gameId', this.get)
      .post('/:gameId/opponent', this.addOpponent);
  }
}

export default new GamesController();
