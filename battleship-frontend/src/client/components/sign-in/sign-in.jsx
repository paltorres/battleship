/**
 * Create user component.
 */
import React from 'react';
import {ApolloConsumer, Mutation} from 'react-apollo';

import SignInForm from './sign-in-form';
import { CREATE_USER } from "./queries";
import { SET_AUTH } from '../login/queries';

const SignIn = ({ history }) => (
  <ApolloConsumer>
    {client => (
      <Mutation
        mutation={CREATE_USER}
        onCompleted={({ createUser: { token, refreshToken }}) => {
          if (token && refreshToken) {
            localStorage.setItem('x-token', token);
            localStorage.setItem('x-refresh-token', refreshToken);
            client.cache.writeQuery({
              query: SET_AUTH,
              data: { auth: { isAuth: true, __typename: 'Auth' } },
            });
            // to home
            history.push('/');
          }
        }}
        onError={console.log}
      >
        {(createUser, { loading, error }) => {
          // show spinner ????
          if (loading) return <div>loading</div>;
          if (error) return <p>An error occurred</p>;

          return <SignInForm createUser={createUser} />;
        }}
      </Mutation>
    )}
  </ApolloConsumer>
);

export default SignIn;
