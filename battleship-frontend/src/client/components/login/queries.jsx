import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      refreshToken
    }
  }
`;

export const SET_AUTH = gql`
  query setAuth {
    auth {
     isAuth
    }
  }
`;
