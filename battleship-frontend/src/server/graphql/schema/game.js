/**
 * Game schema.
 */
import { PubSub, withFilter } from 'apollo-server';
const gamePubsub = new PubSub();

export const typeDef = `
  """
  Enum the allowed player actions.
  """
  enum AvailableActions {
    PLAY
    DELETE
    JOIN
  }
  
  """
  Ship directions.
  """
  enum ShipDirection {
    horizontal
    vertical
  }

  """
  A board cell, contains the coordinate 'X' and 'Y'.
  """
  type Placement {
    """
    Board coordinate X.
    """
    coordinateX: Int!

    """
    Board coordinate Y.
    """
    coordinateY: Int!
  }

  type Ship {
    direction: ShipDirection!
    length: Int!
    type: String!
    placement: Placement!
    sunken: Boolean!
  }

  """
  The fired shots.
  """
  type FiredShots {
    """
    A list of shots with its position.
    """
    shots: [Shot!]
    """
    The player that was shot.
    """
    playerId: ID!
  }
  
  type OpponentBoard {
    """
    A list of shots with its position.
    """
    receivedShots: [Shot!]

    """
    The player that was shot.
    """
    playerId: ID!
  }

  """
  Game board.
  """
  type GameBoard {
    """
    Board dimensions.
    """
    boardDimension: Board!

    """
    The the fired shots.
    """
    opponentsBoard: [OpponentBoard]

    """
    Received shots.
    """
    receivedShots: [Shot!]
    
    """
    The player fleet
    """
    fleet: [Ship!]
  }

  type FleetConfig {
    type: String!
    quantity: Int!
  }
  """
  Basic game data.
  """
  type Game {
    """
    The game's id.
    """
    id: ID!

    """
    The title of the game.
    """
    title: String!

    """
    The game's status.
    """
    status: String!

    """
    The actions that the user is allowed to do.
    """
    availableActions: [AvailableActions!]

    """
    Game board.
    """
    board: Board!
    
    """
    Mod fleet config.
    """
    fleetConfig: [FleetConfig!]
  }

  extend type Query {
    """
    Given an id returns the game with basic detail if the user belong to.
    """
    game(id: ID!): Game

    """
    Returns the game board with its ships.
    """
    gameBoard(id: ID): GameBoard!
  }

  extend type Query {
    """
    Query to get the game detail.
    """
    myGames(status: String): [Game!]!

    """
    Query to the the games that are waiting for an opponent.
    """
    gamePool: [Game!]!  
  }

  type CreateGameResponse {
    id: ID!
  }
  
  type DeleteResponse {
    ok: Boolean!
  }

  extend type Mutation {
    """
    Creates a game.
    """
    createGame(title: String!, mod: String!): CreateGameResponse

    """
    Creates a game.
    """
    joinGame(gameId: ID!): Game    

    """
    Delete a game.
    """
    deleteGame(gameId: ID!): DeleteResponse    
  }

  extend type Subscription {
    newGameToPool: Game!
    gameChange(id: ID!): GameBoard!
    gameStatus(id: ID!): Game!
  }
`;

export const resolvers = {
  Query: {
    game: async (parent, { id }, context) => {
      const game = await context.models.games.get({ id });

      if (!game) {
        throw new Error('Error getting the game');
      }

      return await game;
    },

    async gameBoard(parent, { id }, context) {
      const game = await context.models.games.get({ id });

      if (!game) {
        throw new Error('Error getting the game');
      }

      return game;
    },

    myGames: async (parent, { id }, context) => {
      const games = await context.models.games.myGames();
      if (!games) {
        throw new Error('Error getting `myGames`');
      }
      return games.sort((prevGame, nextGame) => {
        return prevGame.compareGame(nextGame);
      });
    },

    gamePool: async (parent, { id }, context) => {
      const games = await context.models.games.gamePool();
      if (!games) {
        throw new Error('Error getting `gamePool`');
      }
      return games;
    },
  },

  GameBoard: {
    boardDimension(game) {
      return game.board;
    },

    opponentsBoard(game, params, context) {
      if (game.isWaitingForOpponent()) {
        return null;
      }

      return game.opponents.map((opponentPlayer) => {
        const { id } = opponentPlayer;

        const opponentReceivedShots = game.shotHistory.filter((shot) => shot.to === id);
        return {
          receivedShots: opponentReceivedShots.map((shot) => ({miss: shot.miss, placement: { coordinateX: shot.coordinateX, coordinateY: shot.coordinateY }})),
          playerId: id,
        };
      });
    },

    receivedShots(game, params, context) {
      if (game.isWaitingForOpponent()) {
        return null;
      }

      const currentPlayer = game.player;
      const receivedShots = game.shotHistory.filter((shot) => shot.to === currentPlayer.id);

      return receivedShots.map((shot) => ({miss: shot.miss, placement: { coordinateX: shot.coordinateX, coordinateY: shot.coordinateY }}));
    },
  },

  Game: {
    async availableActions(game, params, context) {
      if (!game.player) {
        return await [];
      }

      return await game.player.availableActions.map((action) => {
        switch (action) {
          case 'delete':
            return 'DELETE';
          case 'shot':
            return 'PLAY';
        }
      });
    },
  },

  Mutation: {
    createGame: async (parent, { title, mod }, context) => {
      const game = await context.models.games.create({ title, mod });

      if (!game) {
        throw new Error('Error getting the game');
      }

      await gamePubsub.publish('newGameAdded', game);

      return await game;
    },

    deleteGame: async (parent, { gameId }, context) => {
      const deleteResponse = await context.models.games.deleteGame({ gameId });
      return { ok: Boolean(deleteResponse) };
    },

    joinGame: async (parent, { gameId }, context) => {
      const joinedGame = await context.models.games.joinGame({ gameId });

      if (!joinedGame) {
        throw new Error(`Error joining to game ${gameId}`);
      }

      await gamePubsub.publish('playerJoinedToGame', { gameId });

      return joinedGame;
    },

    async fireShot(parent,{ gameId, shot }, context) {
      const { coordinateX, coordinateY, to } = shot;
      let actionResult = null;
      actionResult = await context.models.games.fireShot({ gameId, playerTarget: to, coordinateX, coordinateY });

      if (!actionResult) {
        throw new Error('shooting error');
      }

      await gamePubsub.publish('fireShot', { gameId });

      return actionResult;
    },
  },

  Subscription: {
    newGameToPool: {
      resolve: async (gameNew) => {
        return await gameNew;
        // return await payload;
      },
      subscribe: () => gamePubsub.asyncIterator('newGameAdded')
    },

    gameChange: {
      resolve: async ({ gameId }, _, context) => {
        const game = await context.models.games.get({ id: gameId });
        console.log("game");
        console.log(game);
        console.log("game");
        console.log("game");
        console.log(game.fleet);
        console.log("game");

        if (!game) {
          throw new Error('Error getting the game');
        }

        return game;
      },
      subscribe: withFilter(
        () => gamePubsub.asyncIterator(['playerJoinedToGame', 'fireShot']),
        ({ gameId }, { id }) => {
          return gameId === id;
        }
      ),
    },

    gameStatus: {
      resolve: async ({ gameId }, _, context) => {
        const game = await context.models.games.get({ id: gameId });
        if (!game) {
          throw new Error('Error getting the game');
        }

        return await game;
        // return await payload;
      },
      subscribe: withFilter(
        () => gamePubsub.asyncIterator(['playerJoinedToGame', 'fireShot']),
        ({ gameId }, { id }) => {
          return gameId === id;
        }
      )
    }

  },
};
