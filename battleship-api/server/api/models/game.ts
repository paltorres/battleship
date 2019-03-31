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
import merge from 'ramda/src/merge';
import prepend from 'ramda/src/prepend';
import findIndex from 'ramda/src/findIndex';
import all from 'ramda/src/all';

import { IGame } from './interfaces/igame';
import { IPlayerModel } from './player';
import { ShotResult } from '../services/board-service';
import { Cell } from "./interfaces/iship";

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
  // isWaitingForOpponent(): boolean,
  isNotInGame(): boolean;
  isNotFinished(): boolean,
  canBeStarted(): boolean,
  canFinish({ lastPlayerTarget }: { lastPlayerTarget: IPlayerModel }): boolean,
  canBeDeleted(): boolean,

  userAlreadyNotExists(user: string): boolean,

  checkIfCanAddUser(userCandidate: string): CheckError,
  checkIfCanShoot({ playerShooter, playerTarget, cellTarget }: { playerShooter: IPlayerModel, playerTarget: IPlayerModel, cellTarget: Cell }): CheckError,

  getPlayerById(player: string): IPlayerModel,
  getPlayerByUser({ user }: { user: string }): IPlayerModel,
  getShotInHistory()

  addShotToHistory({ shotResult, target, shooter }: { shotResult: ShotResult, target: IPlayerModel, shooter: IPlayerModel }): void,
  nextTurn(): void,
  start(): void,
  finish(): void,
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
  shotHistory: [{
    dateCreated: { type: Date,  default: Date.now() },
    miss: {
      type: Boolean,
      require: true,
    },
    shooter: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      select: true,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      select: true,
      required: true,
    },
    coordinateX: {
      type: Number,
      require: true,
    },
    coordinateY: {
      type: Number,
      require: true,
    },
  }],
});

gameSchema.method('isNotInGame', isNotInGame);
gameSchema.method('isNotFinished', isNotFinished);

gameSchema.method('canBeStarted', canBeStarted);
gameSchema.method('canBeDeleted', canBeDeleted);
gameSchema.method('canFinish', canFinish);

gameSchema.method('userAlreadyNotExists', userAlreadyNotExists);

gameSchema.method('checkIfCanAddUser', checkIfCanAddUser);
gameSchema.method('checkIfCanShoot', checkIfCanShoot);

gameSchema.method('getPlayerById', getPlayerById);
gameSchema.method('getPlayerByUser', getPlayerByUser);
gameSchema.method('getShotInHistory', getShotInHistory);

gameSchema.method('addShotToHistory', addShotToHistory);
gameSchema.method('nextTurn', nextTurn);
gameSchema.method('start', start);
gameSchema.method('finish', finish);


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

  return listChecker(checkList);
}

function getShotInHistory({ playerShooter, playerTarget, cellTarget }) {
  const isShooter = equals(playerShooter._id.toString());
  const isTarget = equals(playerTarget._id.toString());
  const isTheCell = equals(cellTarget);
  const someEqual = shot => isShooter(shot.shooter.toString()) && isTarget(shot.to.toString()) && isTheCell({ coordinateX: shot.coordinateX, coordinateY: shot.coordinateY });

  return this.shotHistory.find(someEqual);
}

function getPlayerById(player): IPlayerModel {
  return this.players.find(p => equals(p.id.toString(), player));
}

function checkIfCanShoot({ playerShooter, playerTarget, cellTarget }): CheckError {
  const self = this;
  const userAlreadyExistsCheck = (): boolean => playerShooter;
  const playerCanShootCheck = (): boolean => playerShooter.canShot();
  const playerTargetExistsCheck = (): boolean => playerTarget;
  const targetIsNotShooterCheck = (): boolean => not(equals(playerShooter._id.toString(), playerTarget._id.toString()));
  const notFiredPlaceCheck = (): boolean => not(self.getShotInHistory({ playerShooter, playerTarget, cellTarget }));

  const checkList = [
    {
      passCheck: notFiredPlaceCheck,
      message: 'ups, here is fired',
    },
    {
      passCheck: userAlreadyExistsCheck,
      message: 'The user no belongs to game',
    },
    {
      passCheck: playerTargetExistsCheck,
      message: 'The player target not exists',
    },
    {
      passCheck: targetIsNotShooterCheck,
      message: 'The user can not shot himself',
    },
    {
      passCheck: playerCanShootCheck,
      message: 'User not in turn',
    },
  ];

  return listChecker(checkList);
}

function getPlayerByUser({ user }) {
  return this.players.find(p => equals(p.user._id.toString(), user));
}

function canBeStarted() {
  return equals(this.mod.playerQuantity, this.players.length);
}

function start() {
  this.status = GAME_STATUS.IN_GAME;
}

function addShotToHistory({ shotResult, target, shooter }: { shotResult: ShotResult, target: IPlayerModel, shooter: IPlayerModel }): void {
  const shot = merge(shotResult, { to: target, shooter });
  this.shotHistory = prepend(shot, this.shotHistory);
}

function nextTurn() {
  const findCurrentShooter = findIndex(p => p.canShot());

  const currentTurnIndex = findCurrentShooter(this.players);
  const indexInvalid = equals(-1);
  if (indexInvalid(currentTurnIndex)) {
    // do something?
    return null;
  }

  this.players[currentTurnIndex].setWaitForTurn();

  const isLast = equals(this.players.length - 1);

  const nextTurnIndex = isLast(currentTurnIndex) ? 0 : currentTurnIndex + 1;
  this.players[nextTurnIndex].setCanShot();
}

function canFinish({ lastPlayerTarget }: { lastPlayerTarget: IPlayerModel }): boolean {
  const isSunken = prop('sunken');
  const allFleetSunken = all(isSunken);

  return allFleetSunken(lastPlayerTarget.fleet);
}

function finish(): void {
  this.status = GAME_STATUS;
}

// helper
function listChecker(checkList): { message: string } {
  let errorMessage: string = null;
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

gameSchema.plugin(toJson);

export const Game: Model<IGameModel> = model<IGameModel>('Game', gameSchema);
