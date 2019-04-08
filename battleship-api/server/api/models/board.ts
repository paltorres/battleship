/**
 * Board model.
 */
import any from 'ramda/src/any';
import all from 'ramda/src/all';
import and from 'ramda/src/and';
import eqProps from 'ramda/src/eqProps';
import multiply from 'ramda/src/multiply';
import sum from 'ramda/src/sum';
import prop from 'ramda/src/prop';
import forEach from 'ramda/src/forEach';
import addIndex from 'ramda/src/addIndex';

import { IShip } from './interfaces/iship';
import { IShipModel, Cell } from './ship';

const BOARD_OFFSET = 1;

interface GridValue extends Cell {
  hasShip: boolean,
}

interface IBoard {
  width: number,
  height: number,
  grid: (GridValue[])[],

  getRandomPlace(): Cell,
  shipInValidPlace({ ship }: { ship: IShipModel}): boolean,
  addShip({ ship }: { ship: IShipModel}): void,
}

export class Board implements IBoard {
  width = null;
  height = null;
  grid = null;
  ships = null;

  constructor({ width, height, ships = [] }: { width: number, height: number, ships?: IShip[] }) {
    // add the matrix
    this.width = width;
    this.height = height;
    this.grid = this.makeGrid();
    this.ships = ships;
  }

  private makeGrid(): GridValue[][] {
    const columns = Array.from(new Array(this.height));

    const createRow = (coordinateY: number) => {
      const row = [];
      for (let i = 1; i <= this.width; i++) {
        row.push({ hasShip: false, coordinateY, coordinateX: i });
      }
      return row;
    };

    const addGridValue = (_, index) => {
      columns[index] = createRow(index + BOARD_OFFSET);
    };

    return addIndex(forEach)(addGridValue, columns);
  }

  getRandomPlace(): Cell {
    return {
      coordinateX: this.randomCoordinate(this.width),
      coordinateY: this.randomCoordinate(this.height),
    };
  }

  private canBeCellTaken(gridCell: GridValue): boolean {
    return gridCell && !gridCell.hasShip;
  }

  shipInValidPlace({ ship }: { ship: IShipModel }): boolean {
    const self = this;
    const shipCells = this.getShipCells({ ship });

    const isValidCell = (cell: GridValue): boolean => {
      // const gridCell = self.getCell(cell);
      if (!self.canBeCellTaken(cell)) {
        return false;
      }

      const edgeCells = [
        self.getCell({ coordinateX: cell.coordinateX + 1, coordinateY: cell.coordinateY }),
        self.getCell({ coordinateX: cell.coordinateX - 1, coordinateY: cell.coordinateY }),
        self.getCell({ coordinateX: cell.coordinateX, coordinateY: cell.coordinateY +1 }),
        self.getCell({ coordinateX: cell.coordinateX, coordinateY: cell.coordinateY -1 }),
      ];

      return all(self.canBeCellTaken)(edgeCells);
    };

    return all(isValidCell)(shipCells);
  }

  private randomCoordinate(max) {
    return sum([Math.floor(multiply(Math.random(), max)), BOARD_OFFSET]);
  }

  private getShipCells({ ship }: { ship: IShipModel }): GridValue[] {
    const cells: GridValue[] = [];

    const placement = prop('placement', ship);
    const { coordinateX, coordinateY } = placement;

    if (ship.horizontal()) {
      for (let i = coordinateX; i < coordinateX + ship.length; i++) {
        cells.push(this.getCell({ coordinateX: i, coordinateY }));
      }
    } else {
      for (let i = coordinateY; i < coordinateY + ship.length; i++) {
        cells.push(this.getCell({ coordinateX, coordinateY: i }));
      }
    }

    return cells;
  }

  addShip({ ship }: { ship: IShipModel}): void {
    this.markShipCells({ ship });

    this.ships.push(ship);
  }

  markShipCells({ ship }) {
    const cells: GridValue[] = this.getShipCells({ ship });

    const markGridCell = (cell) : void => { cell.hasShip = true };
    forEach(markGridCell, cells);
  }

  /**
   * The matrix start from 0 and cells start from 1.
   * The method `randomCoordinate` sum the offset.
   * @param cell
   */
  getCell(cell: Cell): GridValue {
    const coordinateY = prop('coordinateY', cell) - BOARD_OFFSET;
    const coordinateX = prop('coordinateX', cell) - BOARD_OFFSET;

    if(this.grid[coordinateY] === undefined) {
      return undefined;
    }

    return this.grid[coordinateY][coordinateX];
  }

  matchPosition({ ship, coordinateX, coordinateY }): boolean {
    const cellTarget: Cell = { coordinateX, coordinateY };
    const shipCells = this.getShipCells({ ship });

    const isCellTarget = shipCell => {
      return and(eqProps('coordinateX', shipCell, cellTarget), eqProps('coordinateY', shipCell, cellTarget))
    };

    return any(isCellTarget)(shipCells);
  }
}
