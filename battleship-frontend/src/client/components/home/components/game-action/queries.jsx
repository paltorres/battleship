import gql from 'graphql-tag';

export const JOIN_GAME = gql`
mutation JoinGame($gameId: ID!) {
  joinGame(gameId: $gameId) {
    id
  }
}
`;

export const DELETE_GAME = gql`
mutation DeleteGame($gameId: ID!) {
  deleteGame(gameId: $gameId) {
    ok
  }
}
`;
