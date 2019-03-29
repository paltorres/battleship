/**
 * Player model.
 */
import values from 'lodash.values';
import { Schema, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

export const PLAYER_ACTIONS = {
  SHOT: 'shot',
  DELETE: 'delete',
};
const ACTION_VALUES: string[] = values(PLAYER_ACTIONS);

const PlayerSchema: Schema = new Schema({
  dateCreated: { type: Date,  default: Date.now() },
  lastUpdated: { type: Date, default: Date.now() },
  userId: {
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

PlayerSchema.method('canDelete', (): boolean => {
  return this.availableActions.indexOf(PLAYER_ACTIONS.DELETE) !== -1;
});

PlayerSchema.method('canShot', (): boolean => {
  return this.availableActions.indexOf(PLAYER_ACTIONS.SHOT) !== -1;
});

PlayerSchema.plugin(toJson);

export default model('Player', PlayerSchema);
