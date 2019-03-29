/**
 *
 */
import GameModel from '../../models/game';
import PlayerModel, { PLAYER_ACTIONS } from '../../models/player';


/*
1 that is 4 spaces long.
2 that are 3 spaces long.
3 that are 2 spaces long.
4 that are 1 space long.
*/

const SHIP_TYPES = {
  'aircraft-carrier': 4,
  'submarine': 3,
  'cruiser': 2,
  'destroyer': 1,
};


class GameService {
  async create({ title, userId }) {
    const initialActions: string[] = [PLAYER_ACTIONS.DELETE];
    const player = await this.createPlayerAndSave({ userId, availableActions: initialActions });

    const game = new GameModel({ title, creator: player.id });

    try {
      await game.validate();
    } catch(e) {
      console.log('The game is not valid!');
      console.log(e);
      throw e;
    }

    try {
      await game.save();
    } catch(e) {
      console.log(e);
      throw new Error('Too much fatal error!');
    }
    console.log(game);

    return game;
  }

  async get({ id, userId }) {
    // add the user id to the check
    return await GameModel.findOne(
      {
        '_id': id,
        $or: [{ opponent: userId }, { creator: userId }],
      })
      .populate('creator')
      .populate('opponent');
  }

  async addOpponent({ id, userId }) {
    const opponent = await this.createPlayerAndSave({ userId });


  }

  private async createPlayerAndSave({ userId, availableActions = [] }) {
    const player = new PlayerModel({ userId, availableActions });

    try {
      await player.validate();
    } catch(e) {
      console.log('The player is not valid!');
      console.log(e);
      throw e;
    }


    try {
      await player.save();
    } catch (e) {
      console.log(e);
      throw e;
    }

    return player;
  }
}

export default new GameService();
