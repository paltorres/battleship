import { IGameMod } from './igame-mod';
import { IPlayer } from './iplayer';
import { IPlayerModel } from '../player';


interface Shot {
  shooter: string,
  to: string,
  coordinateX: number,
  coordinateY: number,
  miss: boolean,
}

export interface IGame {
  dateCreated: Date,
  lastUpdated: Date,
  players: (string|IPlayer|IPlayerModel)[],
  status: string,
  title: string,
  mod: IGameMod,
  shotHistory: Shot[],
}
