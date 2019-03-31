/**
 * Game model.
 */
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import values from 'ramda/src/values';
import equals from 'ramda/src/equals';
import and from 'ramda/src/and';
import gte from 'ramda/src/gte';
import lte from 'ramda/src/lte';
import prop from 'ramda/src/prop';
import not from 'ramda/src/not';

import { IGame } from './interfaces/igame';

export enum GAME_STATUS {
  IN_GAME = 'in_game', 
  WAITING_FOR_OPPONENT = 'waiting_for_opponent', 
  FINISHED = 'finished',
  DELETED = 'deleted',
}

interface CheckError {
  message: string,
}

export interface IGameModel extends IGame, Document {
  isNotInGame(): boolean;
  canBeDeleted(): boolean,
  isWaitingForOpponent(): boolean,
  isNotFinished(): boolean,
  userAlreadyNotExists(user: string): boolean,
  checkIfCanAddUser(userCandidate: string): CheckError,
  canBeStarted(): boolean,
  start(): void,
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
    message: props => `${props.value} is not a valid user or already exists in the game!`,
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
  mod: {
    type: Schema.Types.ObjectId,
    ref: 'GameMod',
    required: true,
  },
});

gameSchema.method('isNotInGame', isNotInGame);
gameSchema.method('canBeDeleted', canBeDeleted);
gameSchema.method('userAlreadyNotExists', userAlreadyNotExists);
gameSchema.method('isNotFinished', isNotFinished);
gameSchema.method('checkIfCanAddUser', checkIfCanAddUser);

gameSchema.method('canBeStarted', canBeStarted);
gameSchema.method('start', start);


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
  return and(gte(this.title.length, TITLE.MIN_LENGTH), lte(this.title.length, TITLE.MAX_LENGTH));
}
function isNotInGame(): boolean {
  return not(equals(this.status, GAME_STATUS.IN_GAME));
}

function canBeDeleted(): boolean {
  return equals(this.status, GAME_STATUS.WAITING_FOR_OPPONENT);
}

function isNotFinished(): boolean {
  return not(equals(this.status, GAME_STATUS.FINISHED));
}

function userAlreadyNotExists(user: string): boolean {
  const player = this.players.find(p =>  equals(p.user._id.toString(), user));
  return not(player);
}

function checkIfCanAddUser(userCandidate: string): CheckError {
  const self = this;
  let errorMessage: string = null;

  const userAlreadyExistsCheck = (): boolean => self.userAlreadyNotExists(userCandidate);
  const isNotFinished = (): boolean  => self.isNotFinished();
  const isNotInGame = (): boolean => self.isNotInGame();

  const checkList = [
    {
      passCheck: userAlreadyExistsCheck,
      message: 'user already exists',
    },
    {
      passCheck: isNotFinished,
      message: 'game finished',
    },
    {
      passCheck: isNotInGame,
      message: 'game in course',
    },
  ];

  let i = 0;
  do {
    const currentCheck = checkList[i];
    const passCheck = prop('passCheck', currentCheck);

    if (!passCheck()) {
      errorMessage = prop('message', currentCheck);
    }
    i = i + 1;
  } while(!errorMessage && i < checkList.length);

  if (errorMessage) {
    return { message: errorMessage };
  }

  return null;
}

function canBeStarted() {
  return equals(this.mod.playerQuantity, this.players.length);
}

function start() {
  this.status = GAME_STATUS.IN_GAME;
}

gameSchema.plugin(toJson);

export const Game: Model<IGameModel> = model<IGameModel>('Game', gameSchema);
