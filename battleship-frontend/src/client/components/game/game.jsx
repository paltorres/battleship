import React from 'react';

import './game.scss';

import Battlefield from './components/battlefield';
import GameStatus from './components/game-status';
import { GAME_DETAIL, GAME_STATUS } from "./queries";
import { compose, graphql } from "react-apollo";


const Game = ({ gameLoading, gameData, subsStatusLoading, subsStatusData, match }) => {
  if (gameLoading) return <div>loading game...</div>;

  const status = !subsStatusLoading && subsStatusData ? subsStatusData.status : gameData.status;
  const availableActions = !subsStatusLoading && subsStatusData ? subsStatusData.availableActions : gameData.availableActions;

  return (
    <div className="game container">
      <h3 className="game__title">{gameData.title}</h3>
      <GameStatus availableActions={availableActions} status={status} fleetConfig={gameData.fleetConfig} />

      <div className="game__battlefield">
        <Battlefield gameId={match.params.gameId} gameStatus={status} board={gameData.board} canShot={availableActions.indexOf('PLAY') !== -1}/>
      </div>
    </div>
  );
};

export default compose(
  graphql(GAME_DETAIL, {
    options: (props) => ({ variables: { gameId: props.match.params.gameId }}),
    props: ({ data }) => ({ gameLoading: data.loading, gameData: data.game }),
  }),
  graphql(GAME_STATUS, {
    options: (props) => ({ variables: { gameId: props.match.params.gameId }}),
    props: ({ data }) => ({ subsStatusLoading: data.loading, subsStatusData: data.gameStatus }),
  }),
)(Game);


// export default Game;
