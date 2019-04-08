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
import not from 'ramda/src/not';
import filter from 'ramda/src/filter';
import pipe from 'ramda/src/pipe';
import identity from 'ramda/src/identity';
import __ from 'ramda/src/__';

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

interface IGameSearch {
  status?: string,
  user_player?: string,
  is_creator?: boolean,
  mod?: string,
}

class GameService {
  async create({ title, user, mod }: GamePayload) {
    const { player, errors } = await playerService.createInitialPlayer({ user });

    if (errors) {
      return errors;
    }

    const gamePayload = { title, players: [ player ], mod };
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

    return { game };
  }

  async getDetail({ id, userId }) {
    // TODO: add the user id in filter
    const game = await Game.findOne({ '_id': id, status: { '$ne': GAME_STATUS.DELETED } })
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

  private async startGame({ game }: { game: IGameModel }) {
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

    await Promise.all(game.players.map(function (p: IPlayerModel): Promise<IPlayerModel> {
      return p.save()
    }));

    game.start();
  }

  async shootPlayer({ gameId, user, shotPayload }) {
    let game: IGameModel;
    const shotHasKey = has(__, shotPayload);

    if (!shotHasKey('playerTarget') || !shotHasKey('coordinateX') || !shotHasKey('coordinateY')) {
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

    if (not(playerTarget)) {
      return { errors: { message: `player target not belong to game ${gameId}` } };
    }

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
    } else {
      const canFinish = await game.canFinish({ lastPlayerShooter: playerShooter });
      if (canFinish) {
        game.finish({ player: playerShooter });
      }
    }

    await Promise.all([
      playerShooter.save(),
      playerTarget.save(),
      game.save(),
    ]);

    return { result: shotResult };
  }

  async search({ params, user }: { params: IGameSearch, user: string }) {
    let query = {};

    if (params.status) {
      query = { ...query, status: params.status };
    }

    let pipeFilters = identity;

    if (params.is_creator) {
      const shouldBeCreator = equals(params.is_creator, 'true');

      const filterGames = (gameList) => {
        return gameList.filter((game) => {
          const player = game.getPlayerByUser({ user });

          if (!player || !player.isCreator) {
            return !shouldBeCreator;
          } else if (player && player.isCreator) {
            return shouldBeCreator;
          }
          return false;
        })
      };

      pipeFilters = pipe(pipeFilters, filterGames);
    }

    if (params.user_player) {
      const userFn = filter((game) => game.getPlayerByUser({ user: params.user_player }));
      pipeFilters = pipe(pipeFilters, userFn);
    }

    if (params.mod) {
      const modFn = filter((game) => game.mod.toString() === params.mod);
      pipeFilters = pipe(pipeFilters, modFn);
    }


    const gameList = await Game.find(query).populate('players');

    const data = pipeFilters(gameList);

    return { count: data.length, data };
  }

  async remove({ id, userId }: { id: string, userId: string }) {
    const game = <IGameModel> await Game.findById(id).populate('players');

    if (!game) {
      return null;
    }

    const player = <IPlayerModel>game.getPlayerByUser({ user: userId });

    if (!player || not(equals(player.user.toString()))) {
      return null;
    }

    if (!player.canDelete() || not(game.canBeDeleted())) {
      return { error: 'Game started or user without permission' };
    }

    await Game.findByIdAndDelete(id);

    return { result: true };
  }
}

export default new GameService();
