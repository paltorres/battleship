/**
 * Game pool component.
 */
import React from 'react';
import { compose, graphql } from "react-apollo";
import ListGroup from 'react-bootstrap/ListGroup';

import {GAME_POOL, NEW_GAME_TO_POOL} from './queries';
import GameAction from './game-action';


const GamePool = ({ poolLoading, poolData, subsPoolLoading, subsPoolData }) => {
  if (poolLoading) return <div>loading games...</div>;

  if (!subsPoolLoading && subsPoolData) {
    poolData.push(subsPoolData);
  }
  return (
    <ListGroup>
      {poolData.map((game) => (
        <ListGroup.Item key={game.id} className="d-flex justify-content-between align-items-center">
          {game.title}

          <GameAction gameId={game.id} action="JOIN"/>

        </ListGroup.Item>
      ))}
    </ListGroup>
  )
};

export default compose(
  graphql(GAME_POOL, {
    fetchPolicy: 'network-only',
    props: ({ data }) => ({ poolLoading: data.loading, poolData: data.gamePool }),
  }),
  graphql(NEW_GAME_TO_POOL, {
    props: ({ data }) => ({ subsPoolLoading: data.loading, subsPoolData: data.newGameToPool }),
  }),
)(GamePool);
