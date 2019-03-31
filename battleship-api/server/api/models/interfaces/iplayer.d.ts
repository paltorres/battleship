import { IUser } from './iuser';
import { IShip } from './iship';
import {IShipModel} from "../ship";

export interface IPlayer {
  dateCreated: Date,
  lastUpdated: Date,
  user: string | IUser,
  accuracy: number,
  availableActions: string[],
  fleet: (string|IShip|IShipModel)[],
  isCreator: boolean,
  turns: number,
  // si esto va aca?
  shoots: number,
}
