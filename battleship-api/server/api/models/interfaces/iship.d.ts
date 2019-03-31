/**
 * Ship interface.
 */

export interface Cell {
  coordinateX: number,
  coordinateY: number,
}

export interface IShip {
  placement: Cell,
  direction: string,
  type: string,
  sunken: boolean,
  length: number,
}
