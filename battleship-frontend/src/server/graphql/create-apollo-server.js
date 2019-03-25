/**
 * Apply the apollo middleware to the given express app.
 */
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import context from './context';

const createApolloServer = ({ app, playground }) => {
  const graphqlServer = new ApolloServer({ ...schema, context, playground });
  graphqlServer.applyMiddleware({ app });
};

export default createApolloServer;
