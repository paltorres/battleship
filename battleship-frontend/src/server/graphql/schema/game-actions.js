/**
 * Game actions
 */

export const typeDef = `
  """
  A board cell, contains the coordinate 'X' and 'Y'.
  """
  input ShotInput {
    """
    Board coordinate X.
    """
    coordinateX: Int!

    """
    Board coordinate Y.
    """
    coordinateY: Int!
    
    """
    The opponent that will receive the shot.
    """
    to: ID!
  }

  type Shot {
    """
    Fired place.
    """
    placement: Placement!
    """
    The result of the shot.
    """
    miss: Boolean!
  }

  """
  The result of the shoot.
  """
  type ShootResult {
    miss: Boolean!
  }

  extend type Mutation {
    """
    Try to shoot to somewhere.
    """
    fireShot(gameId: ID!, shot: ShotInput!): ShootResult
  }
`;

export const resolvers = {
  Mutation: {
  },
};
