/**
 * Connectar a la base de datos y meter este modelo por defecto si no existe cada vez que se inicie el servidor.
 *  5c9f8db88206ea1cbc67708c -> user creador
 * 5c9fb8b38d2dbc686365458a -> se va a unir
 *
 */


export const defaultMod = {
  name: 'Default mod',
  playerQuantity: 2,
  style: 'default',
  fleet: [
    {
      type: 'aircraft-carrier',
      quantity: 1,
    },
    {
      type: 'submarine',
      quantity: 2,
    },
    {
      type: 'cruiser',
      quantity: 3,
    },
    {
      type: 'destroyer',
      quantity: 4,
    },
  ],
  board: {
    height: 10,
    width: 10,
  },
};
