import { IGameMode } from './i-game-mod';

export enum GAME_STATUS {
  IN_GAME, 
  WAITING_FOR_OPPONENT, 
  FINISHED, 
  DELETED,
}

export interface IGame {
  dateCreated: Date,
  lastUpdated: Date,
  players: string[],
  status: string,
  title: string,
  mode: string | IGameMode,
}
