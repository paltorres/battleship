/**
 * Auth service.
 */
import config from 'config';
import jwt from 'jsonwebtoken';

import objOf from 'ramda/src/objOf';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';
import hasPath from 'ramda/src/hasPath';
import identity from 'ramda/src/identity';

import { User, IUserModel } from '../models/user';

const SECRET = config.get('auth.secret');
const SECRET_2 = config.get('auth.secret2');

interface TokenResponse {
  token: string,
  refreshToken: string,
}

class AuthService {
  createTokens(user, refreshSecret = SECRET_2): TokenResponse {
    const token = jwt.sign(
      {
        user: {
          id: prop('id', user),
          username: prop('username', user),
        },
      },
      SECRET,
      objOf('expiresIn')('7d'),
    );

    const refreshToken = jwt.sign(
      {
        user: { id: prop('id', user) },
      },
      refreshSecret,
      objOf('expiresIn')('7d'),
    );

    return { token, refreshToken };
  }

  async refreshTokens(token: string, refreshToken: string) {
    const value = tryCatch(jwt.decode, always(null))(refreshToken);

    if (!value || !hasPath(['user', 'id'], value)) {
      return null;
    }
    const userId = path(['user', 'id'], value);

    // if error, propagate it
    const user: IUserModel = await User.findById(userId);
    const refreshSecret = `${user.password}${SECRET_2}`;

    const verifyError = tryCatch(jwt.verify, identity)(refreshToken, SECRET_2);

    if (verifyError) {
      return null;
    }
    const newTokens = await this.createTokens(user, SECRET_2);

    return { user, ...newTokens };
  }

  verifyToken(token: string) {
    return jwt.verify(token, SECRET);
  }
}

export default new AuthService();
