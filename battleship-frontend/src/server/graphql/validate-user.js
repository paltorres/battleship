/**
 * Given the headers try to get the the current user using tokens.
 */
import restClient from './rest-client';

const validateUser = async ({ headers }) => {
  const token = headers['x-token'] || '';
  const refreshToken = headers['x-refresh-token'] || '';

  if (!refreshToken && !token) {
    return await null;
  }

  const response = await restClient.get(
    'auth/validate',
    { headers: {'x-token': token, 'x-refresh-token': refreshToken } },
  );

  return response.data;
};

export default validateUser;
