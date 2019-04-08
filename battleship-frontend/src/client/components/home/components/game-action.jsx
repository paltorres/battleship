/**
 * Game action.
 */
import React from 'react';

import Join from './game-action/join';
import Play from './game-action/play';
import Delete from './game-action/delete';
import Wait from './game-action/wait';


const GameAction = ({ action, gameId }) => {
  switch (action) {
    case 'PLAY':
      return <Play gameId={gameId} />;
    case 'DELETE':
      return <Delete gameId={gameId} />;
    case 'JOIN':
      return <Join gameId={gameId} />;
    case 'WAITING_FOR_OPPONENT':
      return <Wait gameId={gameId} />;
    default:
      return <span />;
  }
};

GameAction.defaultProps = {
  action: 'WAITING_FOR_OPPONENT',
};

export default GameAction;
