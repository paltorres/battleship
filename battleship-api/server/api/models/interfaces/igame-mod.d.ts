interface FleetConfig {
  type: string,
  quantity: number,
}

interface BoardConfig {
  height: number,
  width: number,
}

export interface IGameMod {
  name: string,
  playerQuantity: number,
  style: string,
  fleet: FleetConfig[],
  board: BoardConfig,
}
