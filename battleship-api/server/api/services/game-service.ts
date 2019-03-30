/**
 * Game service.
 */
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';

import GameModel from '../models/game';

import { makeValidationError, makeErrorObj } from './utils';

class GameService {
  async create({ title, player, mode }) {
    const game = new GameModel({ title, mode, players: [player.id] });

    try {
      await game.validate();
    } catch(error) {
      return makeValidationError(error);
    }

    // send to game pool
    return objOf('game')(game);
  }

  async getDetail({ id, userId }) {
    // add the user id to the check
    return await GameModel.findOne({ '_id': id, players: userId })
      .populate('players')
      .populate('mode');
  }

  async getWithPlayers(id) {
    return await GameModel.findById(id).populate('players');
  }

  async addPlayerToGame({ gameId, player }) {
    let game;
    try {
      game = await GameModel.findById(gameId)
        .populate('players')
        .populate('mode');
    } catch(e) {
      return makeErrorObj(e);
    }

    if (!game) {
      return null;
    }

    game.players.push(player);


    if (game.players.length === game.)

    try {
      await game.validate();
    } catch(error) {
      return makeValidationError(error);
    }
  }
}

export default new GameService();
