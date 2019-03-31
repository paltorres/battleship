/**
 * Games controller.
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes'

import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';
import merge from 'ramda/src/merge';
import pickAll from 'ramda/src/pickAll';
import not from 'ramda/src/not';

import { RequestWithUser } from '../../types';
import log from '../../../common/logger';
import GameService from '../../services/game-service';

class GamesController {
  routes = this.router();

  async get(req: any, res: Response) {
    const userId = path(['user', 'id'], req);

    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'user must be present'});
      return;
    }

    const gameId = path(['params', 'gameId'], req);

    let game;
    try {
      game = await GameService.getDetail({ id: gameId, userId });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
      return;
    }

    if (!game) {
      res.status(HttpStatus.NOT_FOUND).json();
      return;
    }

    res.status(HttpStatus.OK).json(game);
  }

  async create(req: RequestWithUser, res: Response) {
    const body = prop('body', req);
    const userId = path(['user', 'id'], req);

    if (!userId) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'user must be present' });
      return;
    }

    const gamePayload = merge(objOf('user', userId), pickAll(['title', 'mod'], body));

    let operationResult;
    try {
      operationResult = await GameService.create(gamePayload);
    } catch(error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      return;
    }

    const { game, errors } = operationResult;

    if (errors || not(game)) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    res.status(HttpStatus.CREATED).json(game);
  }

  async addPlayer(req: RequestWithUser, res: Response) {
    const user = path(['user', 'id'], req);

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'user must be present' });
      return;
    }

    const gameId = path(['params', 'gameId'], req);

    let operationResult;
    try {
      operationResult = await GameService.addPlayerToGame({ gameId, user });
    } catch (e) {
      log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }

    if (!operationResult) {
      res.status(HttpStatus.NOT_FOUND).json();
      return;
    }

    const { errors, game } = operationResult;

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    res.status(HttpStatus.CREATED).json(game);
  }

  async shotToPlayer(req: RequestWithUser, res: Response) {
    const user = path(['user', 'id'], req);
    const shotPayload = prop('body', req);

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'user must be present' });
      return;
    }

    if (!shotPayload) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Empty body' });
      return;
    }

    const gameId = path(['params', 'gameId'], req);

    let operationResult;
    try {
      operationResult = await GameService.shootPlayer({ gameId, user, shotPayload });
    } catch (e) {
      log.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }

    if (!operationResult) {
      res.status(HttpStatus.NOT_FOUND).json();
      return;
    }

    const { errors, result } = operationResult;

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    res.status(HttpStatus.CREATED).json(result);
  }

  router() {
    return Router()
      .post('/', this.create)
      .get('/:gameId', this.get)
      .post('/:gameId/players', this.addPlayer)
      .post('/:gameId/players/shots', this.shotToPlayer);
  }
}

export default new GamesController();
