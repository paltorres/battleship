/**
 * GameMod model.
 */
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';
import uniqueValidator from 'mongoose-unique-validator';

import { IGameMod } from './interfaces/igame-mod';

export interface IGameModModel extends IGameMod, Document {
}

export const AVAILABLE_STYLES = ['default'];

const gameModSchema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    require: true,
  },
  playerQuantity: {
    type: Number,
    required: true,
    default: 2,
  },
  style: {
    type: String,
    lowercase: true,
    require: true,
    enum: AVAILABLE_STYLES,
    default: 'default',
  },
  fleet: [{
    type: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    _id: false,
  }],
  board: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
});


gameModSchema.plugin(toJson);
gameModSchema.plugin(uniqueValidator);

export const GameMod: Model<IGameModModel> = model<IGameModModel>('GameMod', gameModSchema);
