/**
 * User model.
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// import { BaseUser, UserCreateBody } from '../types/user'
import toJson from '@meanie/mongoose-to-json';

const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
    private: true,
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  dateCreated: { type: Date, default: Date.now() },
  lastUpdated: { type: Date, default: Date.now() },
});

UserSchema.methods.hashPassword = async function () {
  return await bcrypt.hash(this.password, 12);
};

UserSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

UserSchema.plugin(toJson);

export default model('User', UserSchema);
