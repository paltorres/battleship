/**
 * Game service.
 */
import objOf from 'ramda/src/objOf';
import forEach from 'ramda/src/forEach';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import addIndex from 'ramda/src/addIndex';

import PlayerService from './player-service';
import boardService from './board-service';
import { makeValidationError, makeErrorObj } from './utils';

import { IPlayer } from '../models/interfaces/iplayer';
import { Game, IGameModel, GAME_STATUS } from '../models/game';
import { IShipModel } from '../models/ship';
import { IPlayerModel } from '../models/player';

interface GamePayload {
  title: string,
  user: string,
  mod: string,
}

class GameService {
  async create({ title, user, mod }: GamePayload) {
    const { player, errors } = await PlayerService.createInitialPlayer({ user });

    if (errors) {
      return errors;
    }

    const gamePayload = { title, players: [ player.id ], mod };
    const game = new Game(gamePayload);

    try {
      await game.validate();
    } catch(error) {
      return makeValidationError(error);
    }

    // TODO: handle this error
    await player.save();
    try {
      await game.save();
    } catch(e) {
      await player.remove();
      throw e;
    }
    // send to game pool
    return objOf('game')(game);
  }

  async getDetail({ id, userId }) {
    // TODO: add the user id in filter
    const game = await Game.findOne({ '_id': id }).populate('mod').populate('players').populate('players.fleet');

    if (!game) {
      return null;
    }

    const userNotExists = game.userAlreadyNotExists(userId);
    if (userNotExists) {
      return null;
    }

    return game;
  }

  async getWithPlayers(id) {
    return await Game.findById(id).populate('players');
  }

  async addPlayerToGame({ gameId, user }: { gameId: string, user: string }) {
    let game: IGameModel;
    try {
      game = await Game.findOne({ '_id': gameId, status: { '$ne': GAME_STATUS.DELETED }})
        .populate('players')
        .populate('mod');
    } catch(e) {
      return makeErrorObj(e);
    }

    if (!game) {
      return null;
    }

    const error = game.checkIfCanAddUser(user);

    if (error) {
      return { errors: error };
    }

    const { player, errors } = await PlayerService.createPlayer({ user });
    if (errors) {
      return { errors };
    }

    game.players.push(player);
    await player.save(); // duplicated save?

    if (game.canBeStarted()) {
      await this.startGame({ game });
    }

    try {
      await game.validate();
    } catch(error) {
      return makeValidationError(error);
    }

    // if error propagate it
    await game.save();

    return objOf('game', game);
  }

  private async startGame({ game }) {
    // send to topic
    const fleetQantity = path(['players', 'length'], game);
    const fleetList = await boardService.createFleets({ mod: game.mod, fleetQantity });

    const applyFleetToPlayer = (fleet: IShipModel[], index: number) => {
      const player: IPlayerModel = <IPlayerModel>game.players[index];

      PlayerService.applyFleet({ player, fleet });
    };

    addIndex(forEach)(applyFleetToPlayer, fleetList);

    game.start();
  }
}

export default new GameService();
