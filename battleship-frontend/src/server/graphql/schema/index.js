/**
 * Battleship schema.
 */
import merge from 'lodash.merge';

import { typeDef as Game, resolvers as gameResolvers } from './game';
import { typeDef as User, resolvers as userResolvers } from './user';

const Query = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _empty: String
  }

  """
  Common response type.
  """
  type Response {
    id: ID
    success: Boolean
  }
`;

export default {
  typeDefs: [Query, Game, User],
  resolvers: merge(gameResolvers, userResolvers),
};
