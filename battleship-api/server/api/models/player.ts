/**
 * Player model.
 */
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import values from 'ramda/src/values';
import without from 'ramda/src/without';

import { IPlayer } from './interfaces/iplayer';
import { ShotResult } from '../services/board-service';

export enum PLAYER_ACTIONS {
  SHOT = 'shot',
  DELETE = 'delete',
}

export interface IPlayerModel extends IPlayer, Document {
  canDelete(): boolean;
  canShot(): boolean,

  setReadyToPlay(): void,
  setCanShot(): void,
  setWaitForTurn(): void,
  setAsWinner(): void,

  updateScoring(shootResult: ShotResult): void,
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
    enum: values(PLAYER_ACTIONS),
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
  winner: {
    type: Boolean,
    required: true,
    default: false,
  },
});

playerSchema.method('canDelete', canDelete);
playerSchema.method('canShot', canShot);

playerSchema.method('setReadyToPlay', setReadyToPlay);
playerSchema.method('setCanShot', setCanShot);
playerSchema.method('setWaitForTurn', setWaitForTurn);
playerSchema.method('setAsWinner', setAsWinner);

playerSchema.method('updateScoring', updateScoring);


function canDelete(): boolean {
  return this.availableActions.indexOf(PLAYER_ACTIONS.DELETE) !== -1;
}
function canShot(): boolean {
  return this.availableActions.indexOf(PLAYER_ACTIONS.SHOT) !== -1;
}

function setReadyToPlay(): void {
  this.availableActions = [];
}

function setCanShot() {
  if (!this.canShot()) {
    this.availableActions.push(PLAYER_ACTIONS.SHOT);
  }
}

function setWaitForTurn() {
  if (this.canShot()) {
    this.availableActions = without([PLAYER_ACTIONS.SHOT], this.availableActions);
  }
}

function setAsWinner() {
  this.winner = true;
  this.availableActions = [];
}

// TODO: update this
function updateScoring({ shootResult: ShotResult }): void {
  this.accuracy = 0;
}

playerSchema.plugin(toJson);

export const Player: Model<IPlayerModel> = model<IPlayerModel>('Player', playerSchema);
