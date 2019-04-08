import gql from 'graphql-tag';

export const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $mod: String!) {
    createGame(title: $title, mod: $mod) {
      id
    }
  }
`;

export const GET_MODS = gql`
  query Mods {
    mods {
      id
      name
    }
  }
`;

