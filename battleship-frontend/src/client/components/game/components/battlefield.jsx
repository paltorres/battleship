import React from 'react';
import { Mutation, compose, graphql } from "react-apollo";

import { GAME_BOARD, SHOT, GAME_CHANGE } from './queries';
import Board from './board';

const Battlefield = ({ boardLoading, gameBoardData, subsChangesLoading, subsChangesData, board, gameId, canShot }) => {
  if (boardLoading) return <div>loading game board...</div>;

  gameBoardData = !subsChangesLoading && subsChangesData ? subsChangesData : gameBoardData;

  return (
    <div className="row">
      <div className="col">
        <Board config={board} shots={gameBoardData.receivedShots} fleet={gameBoardData.fleet} />
      </div>

      {gameBoardData.opponentsBoard && <div className="col">
        <Mutation
          mutation={SHOT}
          onCompleted={(result) => {
          }}
        >
          {(fireShot, { loading, error }) => {
            if (error) console.log(error);
            if (loading) console.log(loading);

            const onClickCell = (props) => {
              canShot && fireShot({ variables: { gameId, shot: props } });
            };

            return (
              gameBoardData.opponentsBoard.map(({ receivedShots, playerId }) => (
                <Board key={playerId} config={board} shots={receivedShots} playerId={playerId} className="opponent-board" onClickCell={onClickCell} />
              )));
          }}
        </Mutation>
      </div>}
    </div>
  );
};

export default compose(
  graphql(GAME_BOARD, {
    options: (props) => ({ variables: { gameId: props.gameId }}),
    props: ({ data }) => ({ boardLoading: data.loading, gameBoardData: data.gameBoard }),
  }),
  graphql(GAME_CHANGE, {
    options: (props) => ({ variables: { gameId: props.gameId }}),
    props: ({ data }) => ({ subsChangesLoading: data.loading, subsChangesData: data.gameChange }),
  }),
)(Battlefield);
