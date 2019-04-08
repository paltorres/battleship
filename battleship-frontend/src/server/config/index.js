import config from '../../config'
import environments from './environments'

const {
  env,
  paths,
} = config;

export default {
  ...environments[env],
  env,
  paths,
};
