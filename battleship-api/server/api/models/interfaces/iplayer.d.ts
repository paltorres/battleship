import { IUser } from './iuser';
import { IShip } from './iship';

export enum PLAYER_ACTIONS {
  SHOT,
  DELETE,
}

export interface IPlayer {
  dateCreated: Date,
  lastUpdated: Date,
  user: string | IUser,
  accuracy: number,
  availableActions: string[],
  fleet: string[] | IShip[],
  isCreator: boolean,
  turns: number,
  // si esto va aca?
  shoots: number,
}