/**
 * Games controller.
 */
import { Request, Response, Router } from 'express';

import log from '../../../common/logger';
// import GameService from '../../services/game/game-service';

class GamesController {
  routes = this.router();

  async create(req: Request, res: Response) {
    try {
   //   const game = GameService.create(req.body);
     // await game.save();

    } catch (e) {
      log.error(e);

    }
  }

  setStatus(req: Request, res: Response) {

  }


  router() {
    return Router().post('/', this.create)
      .put('/:gameId', this.setStatus);
  }
}

export default new GamesController();
