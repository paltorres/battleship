/**
 * Login component.
 */
import React, { Component } from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';

import LoginForm from './login-form';
import { LOGIN_USER, SET_AUTH } from './queries';

class Login extends Component {
  render() {
    return (
      <ApolloConsumer>
        {client => (
            <Mutation
              mutation={LOGIN_USER}
              onCompleted={({ login: { ok, token, refreshToken }}) => {
                if (ok) {
                  localStorage.setItem('x-token', token);
                  localStorage.setItem('x-refresh-token', refreshToken);
                  client.cache.writeQuery({
                    query: SET_AUTH,
                    data: { auth: { isAuth: true, __typename: 'Auth' } },
                  });
                }
              }}
            >
              {(login, { loading, error }) => {
                // this loading state will probably never show, but it's helpful to
                // have for testing
                if (loading) return <div>loading</div>;
                if (error) return <p>An error occurred</p>;

                return <LoginForm login={login} />;
              }}
            </Mutation>
          )}
      </ApolloConsumer>
    );
  }
}


export default Login;
