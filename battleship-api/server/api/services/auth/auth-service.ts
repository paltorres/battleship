/**
 * Auth service.
 */
import config from 'config';
import jwt from 'jsonwebtoken';
import pick from 'lodash.pick';

import ModelUser from '../../models/user';

const SECRET = config.get('auth.secret');
const SECRET_2 = config.get('auth.secret2');

class AuthService {
  createTokens(user, refreshSecret = SECRET_2): [string, string] {
    const token = jwt.sign(
      {
        user: pick(user, ['id', 'username']),
      },
      SECRET,
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = jwt.sign(
      {
        user: pick(user, 'id'),
      },
      refreshSecret,
      {
        expiresIn: '7d',
      },
    );

    return [token, refreshToken];
  }

  async refreshTokens(token: string, refreshToken: string) {
    let userId = 0;
    try {
      const { user: { id } } = jwt.decode(refreshToken);
      userId = id;
    } catch (err) {
      return {};
    }

    if (!userId) {
      return {};
    }

    const user: any = await ModelUser.findOne({ id: userId });

    if (!user) {
      return {};
    }

    const refreshSecret = user.password + SECRET_2;

    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return {};
    }

    const [newToken, newRefreshToken] = await this.createTokens(user, refreshSecret);
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  verifyToken(token: string) {
    return jwt.verify(token, SECRET);
  }
}

export default new AuthService();
