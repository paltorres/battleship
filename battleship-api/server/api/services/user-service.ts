/**
 * User service.
 */
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';
import identity from 'ramda/src/identity';

import { User, IUserModel } from '../models/user';
import { makeValidationError } from './utils';


interface CreationResponse {
  errors?: object,
  user?: IUserModel,
}

interface UserCreateBody {
  username: string,
  password: string,
}

class UserService {
  async getById(id: string): Promise<IUserModel> {
    return await User.findById(id);
  }

  async create(body: UserCreateBody): Promise<CreationResponse> {
    const user: IUserModel = new User(body);

    try {
      await user.validate();
    } catch(e) {
      return makeValidationError(e);
    }

    await user.hashPassword();
    return { user };
  }

  async validateUser({ username, password }): Promise<IUserModel> {
    const user: IUserModel = await User.findOne({ username });

    if (!user) {
      return null;
    }

    const isValid = await user.comparePassword(password);
    const ifFalseNull = ifElse(identity, always(user), always(null));
    return ifFalseNull(isValid);
  }
}

export default new UserService();
