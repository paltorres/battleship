import gql from 'graphql-tag';

export const SHOT = gql`
mutation FireShot($gameId: ID!, $shot: ShotInput!) {
  fireShot(gameId: $gameId, shot: $shot) {
    miss
  }
}
`;

export const GAME_BOARD = gql`
query gameBoard($gameId: ID!) {
  gameBoard(id: $gameId) {
    opponentsBoard {
      receivedShots {
        placement {
          coordinateX
          coordinateY
        }
        miss
      }
      playerId
    }

    receivedShots {
      placement {
        coordinateX
        coordinateY
      }
      miss
    }

    fleet {
      direction
      type
      sunken
      length
      placement {
        coordinateX
        coordinateY
      }
    }
  }
}
`;

export const GAME_CHANGE = gql`
subscription GameChange($gameId: ID!) {
  gameChange(id: $gameId) {
    opponentsBoard {
      receivedShots {
        placement {
          coordinateX
          coordinateY
        }
        miss
      }
      playerId
    }

    receivedShots {
      placement {
        coordinateX
        coordinateY
      }
      miss
    }

    fleet {
      direction
      type
      sunken
      length
      placement {
        coordinateX
        coordinateY
      }
    }

  }
}
`;
