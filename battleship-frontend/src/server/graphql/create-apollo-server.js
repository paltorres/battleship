/**
 * Apply the apollo middleware to the given express app.
 */
import { ApolloServer } from 'apollo-server-express';
import http  from 'http';

import schema from './schema';
import context from './context';

const createApolloServer = ({ app, playground }) => {
  const graphqlServer = new ApolloServer({
    ...schema,
    context,
    playground,
    subscriptions: {
      onConnect: async (connectionParams) => {
        console.log('Websocket CONNECTED');

        return { headers: connectionParams.headers };
      },
      onDisconnect: () => console.log('Websocket DISCONNECTED'),
    },
  });
  graphqlServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  graphqlServer.installSubscriptionHandlers(httpServer);
  return httpServer;
};

export default createApolloServer;
