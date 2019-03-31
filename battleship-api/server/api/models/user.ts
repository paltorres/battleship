/**
 * User model.
 */
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

import { IUser } from './interfaces/iuser';

export interface IUserModel extends IUser, Document {
  comparePassword(password: string): boolean;
  hashPassword(): Promise<String>,
}

const userSchema: Schema = new Schema({
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

userSchema.method('hashPassword', hashPassword);
userSchema.method('comparePassword', comparePassword);

async function comparePassword(password: string) {
  return await bcrypt.compare(password, this.password);
}

// add this to hook
async function hashPassword() {
  this.password = await bcrypt.hash(this.password, 12);
}

userSchema.plugin(toJson);
userSchema.plugin(uniqueValidator);

export const User: Model<IUserModel> = model<IUserModel>('User', userSchema);
