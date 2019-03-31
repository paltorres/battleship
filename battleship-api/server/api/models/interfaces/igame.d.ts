import { IGameMod } from './igame-mod';
import { IPlayer } from './iplayer';
import { IPlayerModel } from '../player';

export interface IGame {
  dateCreated: Date,
  lastUpdated: Date,
  players: (string|IPlayer|IPlayerModel)[],
  status: string,
  title: string,
  mod: IGameMod,
}
