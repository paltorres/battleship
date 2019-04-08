/**
 * The apollo client.
 */
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';


const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('x-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token'),
  },
}));
/*
const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('x-token', token);
      }

      if (refreshToken) {
        localStorage.setItem('x-refresh-token', refreshToken);
      }
    }

    return response;
  }),
);
*/

const httpLink = createHttpLink({
  credentials: 'same-origin'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      return {
        headers: {
          'x-token': localStorage.getItem('x-token'),
          'x-refresh-token': localStorage.getItem('x-refresh-token'),
        },
      };
    }
  }
});

const operationLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

// const link = afterwareLink.concat(middlewareLink.concat(operationLink));
const link = middlewareLink.concat(operationLink);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
