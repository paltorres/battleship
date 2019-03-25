/**
 * Auth model.
 */
import axios from 'axios';

const generateUserModel = ({ req }) => ({
  async login({ username, password }) {
    return await axios.post('http://localhost:3000/api/battleships/auth/token', { username, password });
  },
});

export default generateUserModel;
