/**
 * Player service.
 */
import PlayerModel, { PLAYER_ACTIONS } from '../models/player';
import { makeValidationError } from './utils';

interface PlayerObj {
  userId: string,
  actions: string[],
  isCreator: Boolean,
}

class PlayerService {

  /**
   * Creates a player and validate it.
   */
  async createPlayer({ userId, actions = [], isCreator = false }: PlayerObj) {
    const values = {
      userId,
      actions,
      isCreator,
    };

    const player = new PlayerModel(values);

    try {
      await player.validate();
    } catch(e) {
      return makeValidationError(e);
    }

    return player;
  }

  /**
   * Given a user id creates a player with initial config as creator.
   * @param userId
   */
  async createInitialPlayer({ userId }) {
    const values = {
      userId,
      actions: [PLAYER_ACTIONS.DELETE],
      isCreator: true,
    };

    return await this.createPlayer(values);
  }

  /**
   * Given a player assign and validate the fleet.
   */
  async addFleet({ player, fleet }) {
    player.fleet = fleet;

    try {
      await player.validate();
    } catch(e) {
      return makeValidationError(e);
    }

    return player;
  }
}

export default new PlayerService();
