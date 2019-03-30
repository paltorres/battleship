/**
 * Player model.
 */
import values from 'ramda/src/values';
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import { IPlayer, PLAYER_ACTIONS } from './interfaces/iplayer';

const ACTION_VALUES: string[] = values(PLAYER_ACTIONS);

export interface IPlayerModel extends IPlayer, Document {
  canDelete(): boolean;
  canShot(): boolean,
}

const playerSchema: Schema = new Schema({
  dateCreated: { type: Date,  default: Date.now() },
  lastUpdated: { type: Date, default: Date.now() },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  availableActions: {
    type: [String],
    lowercase: true,
    enum: ACTION_VALUES,
    default: [],
  },
  fleet: [{
    type: Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  }],
  isCreator: {
    type: Boolean,
    required: true,
    default: false,
  },
  turns: {
    type: Number,
    required: true,
    default: 0,
  },
  // si esto va aca?
  shoots: {
    type: Number,
    required: true,
    default: 0,
  },
});

playerSchema.method('canDelete', canDelete);
playerSchema.method('canShot', canShot);


function canDelete(): boolean {
  return this.availableActions.indexOf(PLAYER_ACTIONS.DELETE) !== -1;
}
function canShot(): boolean {
  return this.availableActions.indexOf(PLAYER_ACTIONS.SHOT) !== -1;
}

playerSchema.plugin(toJson);

export const Player: Model<IPlayerModel> = model<IPlayerModel>('Player', playerSchema);
