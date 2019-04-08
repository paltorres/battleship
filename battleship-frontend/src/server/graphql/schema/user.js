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
    token: String
    refreshToken: String
  }

  extend type Mutation {
    login(username: String!, password: String!): LoginResponse
    createUser(username: String!, password: String!): LoginResponse
  }
`;

export const resolvers = {
  Query: {
    me: async (parent, params, context) => {
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
        throw new Error('wrong username or password');
      }
    },

    createUser: async (parent, { username, password}, context) => {
      try {
        await context.models.user.create({ username, password });
      } catch (e) {
        console.log(e);
        return { token: null, refreshToken: null };
      }

      try {
        const loginResponse = await context.models.user.login({ username, password });
        return loginResponse.data;
      } catch (e) {
        console.log(e);
        return e.response.data;
      }
    }
  },
};
