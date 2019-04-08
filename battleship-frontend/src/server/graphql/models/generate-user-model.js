/**
 * Auth model.
 */
import restClient from '../rest-client';

const generateUserModel = () => ({
  async login({ username, password }) {
    return await restClient.post('auth/token', { username, password });
  },
  async create({ username, password }) {
    return await restClient.post('users', { username, password });
  },
});

export default generateUserModel;
