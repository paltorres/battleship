/**
 * Ship Service.
 */
import multiply from 'ramda/src/multiply';

 import { Ship, IShipModel, SHIP_DIRECTIONS } from '../models/ship';

class ShipService {
  create({ type, placement = null }): IShipModel {
    const direction = this.randomDirection();
    const ship = new Ship({ type, direction, placement });

    return ship;
  }

  randomDirection() {
    return SHIP_DIRECTIONS[Math.floor(multiply(Math.random(), SHIP_DIRECTIONS.length))];
  }

  async saveAll({ fleet }: { fleet: IShipModel[]}): Promise<IShipModel[]> {
    await Ship.insertMany(fleet);
    return fleet;
  }
}

export default new ShipService();
