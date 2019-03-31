/**
 * Player service.
 */
import { Player, PLAYER_ACTIONS, IPlayerModel } from '../models/player';
import { makeValidationError } from './utils';
import { IShipModel } from '../models/ship';

interface IPlayerCreationObj {
  user: string,
  availableActions?: string[],
  isCreator?: Boolean,
}

interface IPlayerResponse {
  errors?: object,
  player?: IPlayerModel,
}

class PlayerService {

  /**
   * Creates a player and validate it.
   */
  async createPlayer({ user, availableActions = [], isCreator = false }: IPlayerCreationObj): Promise<IPlayerResponse> {
    const values = {
      user,
      availableActions,
      isCreator,
    };

    const player = new Player(values);

    try {
      await player.validate();
    } catch(e) {
      return makeValidationError(e);
    }

    return { player };
  }

  /**
   * Given a user id creates a player with initial config as creator.
   * @param userId
   */
  async createInitialPlayer({ user }) {
    const values: IPlayerCreationObj = {
      user,
      availableActions: [PLAYER_ACTIONS.DELETE],
      isCreator: true,
    };

    return await this.createPlayer(values);
  }

  /**
   * Given a player assign and validate the fleet and the user is ready to play.
   */
  applyFleet({ player, fleet }: { player: IPlayerModel, fleet: IShipModel[] }): void {
    player.fleet = fleet;
    player.setReadyToPlay();
  }
}

export default new PlayerService();
