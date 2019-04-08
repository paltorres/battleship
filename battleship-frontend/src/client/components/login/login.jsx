/**
 * Login component.
 */
import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';


import LoginForm from './login-form';
import { LOGIN_USER, SET_AUTH } from './queries';

const Login = () => (
  <ApolloConsumer>
    {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login: { token, refreshToken }}) => {
            if (token && refreshToken) {
              localStorage.setItem('x-token', token);
              localStorage.setItem('x-refresh-token', refreshToken);

              client.cache.writeQuery({
                query: SET_AUTH,
                data: { auth: { isAuth: true, __typename: 'Auth' } },
              });
            }
          }}
          onError={console.log}
        >
          {(login, { loading, error }) => {
            if (loading) return <div>loading</div>;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
  </ApolloConsumer>
);


export default Login;
