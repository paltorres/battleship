/**
 * GameMods controller.
 */
import { Router, Request, Response } from 'express';

import * as HttpStatus from 'http-status-codes';
import path from 'ramda/src/path';

import GameModService from '../../services/game-mod-service';


class GameModController {
  routes = this.router();

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body;

    let operationResult;
    try {
      operationResult = await GameModService.create(body);
    } catch(error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      return;
    }

    const { errors, gameMod } =operationResult

    if (errors) {
      res.status(HttpStatus.BAD_REQUEST).json(errors);
      return;
    }

    res.status(HttpStatus.CREATED).json(gameMod);
  }

  async get(req: Request, res: Response): Promise<void> {
    const gameModId = path(['params', 'gameModId'], req);

    let game;

    try {
      game = await GameModService.get(gameModId);
    } catch(e) {
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

  async getAll(req: Request, res: Response): Promise<void> {
    let allMods;
    try {
      allMods = await GameModService.getAll();
    } catch(e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
      return;
    }

    res.status(HttpStatus.OK).json(allMods);
  }

  router() {
    return Router()
      .post('/', this.create)
      .get('/', this.getAll)
      .get('/:gameModId', this.get);
  }
}

export default new GameModController();
