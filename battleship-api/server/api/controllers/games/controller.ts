/**
 * Games controller.
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes'

import path from 'ramda/src/path';
import prop from 'ramda/src/prop';

import log from '../../../common/logger';
import GameService from '../../services/game-service';

class GamesController {
  routes = this.router();

  async get(req: any, res: Response) {
    const userId = path(['user', 'id'], req);

    if (!userId) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'user must be present'});
      return;
    }

    const gameId = path(['params', 'gameId'], req);

    let game;
    try {
      game = await GameService.getDetail({ id: gameId, userId });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
      return;
    }

    if (!game) {
      res.status(HttpStatus.NOT_FOUND).json();
      return;
    }

    res.status(HttpStatus.OK).json(game);
  }

  async create(req: any, res: Response, next: NextFunction) {
    const body = prop('body', req);
    const userId = path('user', 'id', req);

    if (!userId) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'user must be present' });
      return;
    }

    const { game, errors } = await GameService.create(body);

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    try {
      await game.save();
    } catch(error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      return;
    }

    res.status(HttpStatus.CREATED).json(game);
  }

  async addPlayer(req: any, res: Response, next: NextFunction) {
    const userId = path(['user', 'id'], req);

    if (!userId) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'user must be present' });
      return;
    }

    const gameId = path(['params', 'gameId'], req);
    const gameFound = await GameService.getSimple(gameId);

    if (!gameFound) {
      res.status(HttpStatus.NOT_FOUND).json();
      return;
    }

    const { game, errors } = await GameService.addPlayerToGame({ game: gameFound, userId });

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    try {
      await game.save();
    } catch (e) {
      log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }

    res.status(HttpStatus.CREATED).json(game);
  }

  router() {
    return Router().post('/', this.create)
      .get('/:gameId', this.get)
      .post('/:gameId/players', this.addPlayer);
  }
}

export default new GamesController();
