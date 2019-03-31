/**
 * Game service.
 */
import objOf from 'ramda/src/objOf';
import forEach from 'ramda/src/forEach';
import last from 'ramda/src/last';
import path from 'ramda/src/path';
import addIndex from 'ramda/src/addIndex';
import prop from 'ramda/src/prop';
import has from 'ramda/src/has';
import equals from 'ramda/src/equals';
import __ from 'ramda/src/__';
import not from 'ramda/src/not';

import playerService from './player-service';
import shipService from './ship-service';
import boardService from './board-service';
import { makeValidationError, makeErrorObj } from './utils';

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
    const { player, errors } = await playerService.createInitialPlayer({ user });

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
    const game = await Game.findOne({ '_id': id })
      .populate('mod')
      .populate('players');

    if (!game) {
      return null;
    }

    const userNotExists = game.userAlreadyNotExists(userId);
    if (userNotExists) {
      return null;
    }

    const player = game.getPlayerByUser({ user: userId });
    player.fleet = await shipService.getFleetDetail(<string[]>player.fleet);

    const filterFleet = (p) => {
      if (not(equals(p._id.toString(), player._id.toString()))) {
        p.fleet = null;
      }
    };

    forEach(filterFleet)(game.players);

    return game;
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

    const { player, errors } = await playerService.createPlayer({ user });
    if (errors) {
      return { errors };
    }

    game.players.push(player);

    if (game.canBeStarted()) {
      await this.startGame({ game });
    } else {
      await player.save();
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
    const fleetQuantity = path(['players', 'length'], game);
    const fleetList = await boardService.createFleets({ mod: game.mod, fleetQuantity });

    const applyFleetToPlayer = (fleet: IShipModel[], index: number) => {
      const player: IPlayerModel = <IPlayerModel>game.players[index];

      playerService.applyFleet({ player, fleet });
    };

    addIndex(forEach)(applyFleetToPlayer, fleetList);

    // at the begin the last player added can shot
    const lastPlayerAdded = last(game.players);
    lastPlayerAdded.setCanShot();

    await Promise.all(game.players.map(async p => await p.save()));
    game.start();
  }

  async shootPlayer({ gameId, user, shotPayload }) {
    let game: IGameModel;
    const hasKey = has(__, shotPayload);

    if (!hasKey('playerTarget') || !hasKey('coordinateX') || !hasKey('coordinateY')) {
      return { errors: 'The values: playerTarget, coordinateX and coordinateY are required' };
    }

    try {
      game = await Game.findOne({ '_id': gameId, status: GAME_STATUS.IN_GAME  })
        .populate('players')
        .populate('mod');
    } catch(e) {
      return makeErrorObj(e);
    }

    if (!game) {
      return null;
    }

    const { coordinateX, coordinateY } = shotPayload;
    const playerShooter = game.getPlayerByUser({ user });
    const playerTarget = game.getPlayerById(prop('playerTarget', shotPayload));

    const error = game.checkIfCanShoot({ playerShooter, playerTarget, cellTarget: { coordinateX, coordinateY } });

    if (error) {
      return { errors: error };
    }

    const isValidPlace = boardService.isValidPlace({ mod: game.mod, coordinateX, coordinateY });

    if (!isValidPlace) {
      return { errors: { message: 'out of range' } };
    }

    const shotResult = await boardService.shoot({ mod: game.mod, fleetTarget: <string[]>playerTarget.fleet, coordinateX, coordinateY });

    game.addShotToHistory({ shotResult, target: playerTarget, shooter: playerShooter });

    playerShooter.updateScoring(shotResult);

    if (shotResult.miss) {
      game.nextTurn();
    } else if (game.canFinish({ lastPlayerTarget: playerTarget })) {
      // TODO: send the new to topic
      game.finish();
    }

    await playerShooter.save();
    await playerTarget.save();
    await game.save();

    return { result: shotResult };
  }
}

export default new GameService();
