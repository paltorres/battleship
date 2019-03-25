/**
 * The apollo client.
 */
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { onError, ErrorHandler, ErrorResponse } from 'apollo-link-error';
// import gql from 'graphql-tag';

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('x-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token'),
  },
}));

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

// TODO: arreglar esta parte, que pasa si me response mal la api
/*
export const SET_AUTH = gql`
  query setAuth {
    auth {
     isAuth
    }
  }
`;



const errorLink = onError(({ operation, networkError, graphQLErrors, response }) => {
  operation.getContext().cache.writeQuery({
    query: SET_AUTH, data:
      {auth: {isAuth: false, __typename: 'Auth'}}
  });
});
*/
const httpLink = createHttpLink({
  credentials: 'same-origin'
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
