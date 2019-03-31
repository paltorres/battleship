/**
 * Ship Service.
 */
import multiply from 'ramda/src/multiply';
import map from 'ramda/src/map';

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

  async getFleetDetail(fleet: string[]): Promise<IShipModel[]> {
    return await Ship.find({ '_id': { '$in': fleet } });
  }
}

export default new ShipService();
