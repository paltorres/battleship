/**
 * Game model.
 */
import values from 'ramda/src/values';
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import { IGame, GAME_STATUS } from './interfaces/igame';

export interface IGameModel extends IGame, Document {
  isInGame(): boolean;
  canBeDeleted(): boolean,
  isWaitingForOpponent(): boolean,
  isFinished(): boolean,
  isDeleted(): boolean,
}

const TITLE = {
  MAX_LENGTH: 200,
  MIN_LENGTH: 1,
};

const gameSchema: Schema = new Schema({
  dateCreated: { type: Date,  default: Date.now() },
  lastUpdated: { type: Date, default: Date.now() },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
    select: true,
    validate: validatePlayers,
    message: props => `${props.value} is not a valid user or already exists in the game!`
  }],
  status: {
    type: String,
    enum: values(GAME_STATUS),
    default: GAME_STATUS.WAITING_FOR_OPPONENT,
  },
  title: {
    type: String,
    required: true,
    validate: validateTitle,
  },
  mode: {
    type: Schema.Types.ObjectId,
    ref: 'GameMod',
    required: true,
  },
});

gameSchema.method('isInGame', isInGame);
gameSchema.method('canBeDeleted', canBeDeleted);

// The player shouldn't be twice
function validatePlayers(player) {
  const playerAlreadyBelongs = this.players.indexOf(player) === -1;
  if (playerAlreadyBelongs) {
    return false;
  }

  // check if the user exists in the game
  // const userAlreadyInGame = this.players.find(p => p.userId === player.userId);

  // return !userAlreadyInGame;
  return true;
}

function validateTitle() {
  return this.title.length >= TITLE.MIN_LENGTH && this.title.length <= TITLE.MAX_LENGTH;
}
function isInGame(): boolean {
  return this.status === GAME_STATUS.IN_GAME;
}

function canBeDeleted(): boolean {
  return this.status === GAME_STATUS.WAITING_FOR_OPPONENT;
}

gameSchema.plugin(toJson);

export const Game: Model<IGameModel> = model<IGameModel>('User', gameSchema);
