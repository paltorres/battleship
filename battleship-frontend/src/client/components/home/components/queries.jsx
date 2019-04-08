import gql from 'graphql-tag';

export const MY_GAMES = gql`
query myGames {
  myGames {
    id
    title
    availableActions
    status
  }
}
`;

export const GAME_POOL = gql`
query gamePool {
  gamePool {
    id
    title
    availableActions
    status
  }
}
`;

export const NEW_GAME_TO_POOL = gql`
subscription NewGameToPool {
  newGameToPool {
    id
    title
    availableActions
    status
  }
}
`;

export const GAME_CHANGE_SUBSCRIPTION = gql`
subscription GameChange($gameId: ID!) {
  gameChange(gameId: $gameId) {
    id
    title
    availableActions
    status
  }
}
`;
