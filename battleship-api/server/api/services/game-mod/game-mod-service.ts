/**
 *
 */
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';

import GameModModel from '../../models/game-mod';

interface CreateResult {
  errors?: object,
  gameMod?: any,
}

class GameModService {
  async create(body): Promise<CreateResult> {
    const gameMod = new GameModModel(body);

    try {
      await gameMod.validate();
    } catch(error) {
      return objOf('errors')(prop('errors')(error));
    }

    return { gameMod };
  }

  async get(id: string) {
    return await GameModModel.findById(id);
  }

  async getAll() {
    return await GameModModel.find({});
  }
}

export default new GameModService();
