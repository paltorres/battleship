/**
 * Game mod service.
 */
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';

import { GameMod, IGameModModel } from '../models/game-mod';


interface GameModCreateResult {
  errors?: object,
  gameMod?: IGameModModel,
}

class GameModService {
  async create(body): Promise<GameModCreateResult> {
    const gameMod = new GameMod(body);

    try {
      await gameMod.validate();
    } catch(error) {
      return objOf('errors')(prop('errors')(error));
    }

    await gameMod.save();

    return objOf('gameMod')(gameMod);
  }

  async get(id: string) {
    return await GameMod.findById(id);
  }

  async getAll() {
    return await GameMod.find({});
  }
}

export default new GameModService();
