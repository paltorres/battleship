/**
 * Board service.
 */
import prop from 'ramda/src/prop';

import ShipService from '../services/ship-service';

import { Board } from '../models/board';
import { Cell, IShipModel, Ship } from '../models/ship';
import { IGameMod } from '../models/game-mod';

export interface ShotResult extends Cell {
  miss: boolean,
}

class BoardService {
  async createFleets({ mod, fleetQuantity }: { mod: IGameMod, fleetQuantity: number }): Promise<any> {
    const self = this;
    // promise all

    return await Promise.all(
      Array.from(
        Array(fleetQuantity),
        async () => await self.createFleet(mod),
      ));
  }

  private async createFleet(mod: IGameMod): Promise<IShipModel[]> {
    const gameBoard = new Board(prop('board', mod));
    const fleet = prop('fleet', mod);

    for (let i = 0; i < fleet.length; i++) {
      const shipConfig = fleet[i];

      const { quantity, type } = shipConfig;

      for (let k = 0; k < quantity; k++) {

        let placed = false;
        const ship: IShipModel = ShipService.create({ type });

        while (!placed) {
          ship.direction = ShipService.randomDirection();
          ship.placement = gameBoard.getRandomPlace();
          const isValid = gameBoard.shipInValidPlace({ ship });

          if (isValid) {
            gameBoard.addShip({ ship });
            placed = true;
          }
        }
      }
    }

    return await ShipService.saveAll({ fleet: gameBoard.ships});
  }

  isValidPlace({ mod, coordinateX, coordinateY }) {
    const gameBoard = prop('board', mod);
    return this.isNotOutOfRange(coordinateY, gameBoard.height) && this.isNotOutOfRange(coordinateX, gameBoard.width);
  }

  private isNotOutOfRange(coord, limit) {
    return coord >= 1 && coord <= limit;
  }

  async shoot({ mod, fleetTarget, coordinateX, coordinateY }: { mod: IGameMod, fleetTarget: string[], coordinateX: number, coordinateY: number }): Promise<ShotResult> {
    const { height, width } = mod.board;
    const board = new Board({ height, width });

    const shotResult: ShotResult = {
      coordinateX,
      coordinateY,
      miss: true,
    };

    let ship: IShipModel = null;
    let match = false;
    for (let i = 0; i < fleetTarget.length && !match; i++) {
      const shipId = fleetTarget[i];
      ship = await Ship.findById(shipId);
      match = board.matchPosition({ ship, coordinateX, coordinateY });
    }

    if (!match) {
      return shotResult;
    }

    ship.hit();
    await ship.save();

    shotResult.miss = false;

    return shotResult;
  }
}

export default new BoardService();
