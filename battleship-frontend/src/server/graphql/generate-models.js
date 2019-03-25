/**
 *
 */
import generateUserModel from './models/generate-user-model';

const generateModels = ({ req }) => ({
  user: generateUserModel({ req }),
});

export default generateModels;
