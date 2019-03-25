/**
 * Auth model.
 */
import axios from 'axios';

const getUser = async ({ req }) => {
  const response = await axios.get('http://localhost:3000/api/battleships/auth/me', {headers: {'x-token': req.headers['x-token']}});
  return response.data;
};

export default getUser;
