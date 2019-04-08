import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

