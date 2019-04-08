/**
 *
 */
import React from 'react';
import { Query, Subscription, graphql, compose } from 'react-apollo';

import ListGroup from "react-bootstrap/ListGroup";
import { MY_GAMES } from './queries';

import GameAction from './game-action';

const MyGames = () => (
  <Query query={MY_GAMES}>
    {({ loading, error, data }) => {
      if (loading) return <div>loading games...</div>;
      if (error) return <div>error getting games</div>;

      return (
        <ListGroup>
          {data.myGames.map((game) => (
            <ListGroup.Item key={game.id} className="d-flex justify-content-between align-items-center">
              {game.title}

              {game.availableActions.length && game.availableActions.map((action) => (
                <GameAction key={`${game.id}_${action}`} gameId={game.id} action={action} />
              )) || <GameAction />}

            </ListGroup.Item>
          ))}
        </ListGroup>
      )
    }}
  </Query>
);

export default MyGames;
