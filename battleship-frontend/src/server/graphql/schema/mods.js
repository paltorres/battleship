/**
 * User schema.
 */
export const typeDef = `
  type Board {
    width: Int!
    height: Int!
  }

  type ModResponse {
    id: ID!
    name: String!
    style: String!
    playerQuantity: Int!
    board: Board!
  }
  
  extend type Query {
    mods: [ModResponse!]!
  }
`;

export const resolvers = {
  Query: {
    mods: async (parent, params, context) => {
      let modsResponse;
      try {
        modsResponse = await context.models.mods.getAll();
      } catch(e) {
        console.log(e);
        throw new Error('Error getting the mods');
      }

      return modsResponse.data;
    },
  },
};
