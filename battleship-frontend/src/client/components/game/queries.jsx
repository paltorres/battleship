import gql from 'graphql-tag';

export const GAME_DETAIL = gql`
query GetGame($gameId: ID!) {
  game(id: $gameId) {
    id
    title
    availableActions
    status
    board {
      width
      height
    }
    fleetConfig {
      type
      quantity
    }
  }
}
`;

export const GAME_STATUS = gql`
subscription gameStatus($gameId: ID!) {
  gameStatus(id: $gameId) {
    availableActions
    status
  }
}
`;
