/**
 * Game modes model.
 */
import restClient from '../rest-client';

const generateGameModModel = () => ({
  async getAll() {
    return await restClient.get('mods');
  },
});

export default generateGameModModel;
