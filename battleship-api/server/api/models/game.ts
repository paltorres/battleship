/**
 * User model.
 */
import values from 'lodash.values';
import { Schema, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';
import {PLAYER_ACTIONS} from "./player";

// TODO: move to constant module
export const GAME_STATUS = {
  IN_GAME: 'in_game', 
  WAITING_FOR_OPPONENT: 'waiting_for_opponent', 
  FINISHED: 'finished', 
  DELETED: 'deleted',
};

const TITLE = {
  MAX_LENGTH: 200,
  MIN_LENGTH: 1,
};

const GameSchema = new Schema({
  dateCreated: { type: Date,  default: Date.now() },
  lastUpdated: { type: Date, default: Date.now() },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
    validate: validateOPlayers,
    default: null,
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
  mode: {
    type: Schema.Types.ObjectId,
    ref: 'GameMod',
    required: true,
  },
});

GameSchema.plugin(toJson);

GameSchema.method('isInGame', isInGame);
GameSchema.method('canBeDeleted', canBeDeleted);


// The player shouldn't be twice
function validateOPlayers(player) {
  return this.players.indexOf(player) === -1;
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


export default model('Game', GameSchema);
