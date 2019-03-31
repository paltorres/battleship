/**
 *
 */
import prop from 'ramda/src/prop';

import ShipService from '../services/ship-service';

import { Board } from '../models/board';
import { IShipModel } from '../models/ship';
import { IGameMod } from '../models/game-mod';


class BoardService {
  async createFleets({ mod, fleetQantity }: { mod: IGameMod, fleetQantity: number }): Promise<any> {
    const self = this;
    // promise all

    return await Promise.all(
      Array.from(
        Array(fleetQantity),
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
            // ship.placement = placement;
            console.log("ship placed");
            gameBoard.addShip({ ship });
            placed = true;
          } else {
            // console.log("not valid ship");
            // console.log(ship);
            // console.log("");
          }
        }

      }
    }

    return await ShipService.saveAll({ fleet: gameBoard.ships});
  }
}

export default new BoardService();
