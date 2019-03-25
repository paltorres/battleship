/**
 * User schema.
 */

export const typeDef = `
  type User {
    id: ID!
    username: String!
  }
  
  extend type Query {
    me: User
  }
  
  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
  }

  extend type Mutation {
    login(username: String!, password: String!): LoginResponse
  }
`;

// podemos usar directivas para eso, maybe?

export const resolvers = {
  Query: {
    me: async (parent, params, context) => {
      console.log('asdasd');
      console.log(context);
      // const response = await context.models.user.me({ username, password });
      return context.user;
    },
  },
  Mutation: {
    login: async (parent, { username, password}, context) => {
      try {
        const response = await context.models.user.login({ username, password });
        return response.data;
      } catch (e) {
        return e.response.data;
      }
    },
  },
  User: {
  }
};
