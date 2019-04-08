/**
 * Battleship schema.
 */
import merge from 'lodash.merge';

import { typeDef as Game, resolvers as gameResolvers } from './game';
// import { typeDef as Game, resolvers as gameResolvers } from './game.subs';
import { typeDef as User, resolvers as userResolvers } from './user';
import { typeDef as GameActions, resolvers as gameActionsReslver } from './game-actions';
import { typeDef as Mods, resolvers as modsResolvers } from './mods';

const Query = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _empty: String
  }
  
  type Subscription {
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
  typeDefs: [Query, User, Mods, GameActions, Game],
  resolvers: merge(userResolvers, modsResolvers, gameActionsReslver, gameResolvers),
};
