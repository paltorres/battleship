/**
 * User service.
 */
import UserModel from '../../models/user';

import { UserCreateBody, BaseUser, ValidateUserRequest } from '../../types/user';

class UserService {
  async getById(id: string) {
    const user = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(body: UserCreateBody): Promise<BaseUser> {
    const userCreated = await UserModel.findOne({ username: body.username });
    if (userCreated) {
      return null;
    }

    const user: any = new UserModel(body);

    if (!user) {
      return null;
    }

    user.password = await user.hashPassword();

    await user.save();

    return user;
  }

  async validateUser({ username, password }: ValidateUserRequest): Promise<BaseUser> {
    const user: any = await UserModel.findOne( { username });
    if (!user) {
      return null;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}

export default new UserService();
