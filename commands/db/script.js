const modData = {
  name: 'Normal - 1 vs 1',
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

const fastGame = {
  name: 'Fast - 1 vs 1',
  playerQuantity: 2,
  style: 'default',
  fleet: [
    {
      type: 'destroyer',
      quantity: 1,
    },
  ],
  board: {
    height: 3,
    width: 3,
  },
};


db.gamemods.insert(modData);
db.gamemods.insert(fastGame);
