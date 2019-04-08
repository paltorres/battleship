/**
 * Returns the models with the user id injected.
 */
import generateUserModel from './models/generate-user-model';
import generateGameModel from './models/generate-game-model';
import generateGameModModel from './models/generate-game-mods-model';

const generateModels = ({ user }) => ({
  user: generateUserModel(),
  games: generateGameModel({ user }),
  mods: generateGameModModel(),
});

export default generateModels;
