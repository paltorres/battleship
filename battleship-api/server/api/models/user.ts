/**
 * User model.
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// import { BaseUser, UserCreateBody } from '../types/user'

const UserSchema = new Schema({
  password: { type: String, required: true, },
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

UserSchema.method('toClient', () => {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
});

export default model('User', UserSchema);
