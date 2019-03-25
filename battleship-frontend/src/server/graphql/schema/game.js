/**
 * Game schema.
 */
export const typeDef = `
  enum AvailableActions {
    PLAY
    DELETE
    JOIN
  }

  type Game {
    id: ID
    title: String
    status: String
    """
    The actions that the user is allowed to do.
    """
    availableAction: AvailableActions
  }
  
  union GameResponse = Game | Response

  extend type Query {
    """
    Given an id returns the game detail if the user belong to.
    """
    game(id: ID!): GameResponse

    """
    Query to get the game detail.
    """
    myGames(status: String): [Game]
  }
`;

export const resolvers = {
  Query: {
    game: () => {},
    myGames: () => {},
  },
};
