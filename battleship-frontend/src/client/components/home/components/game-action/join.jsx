import React from 'react';
import { Mutation } from 'react-apollo';
import Badge from 'react-bootstrap/Badge';
import { withRouter } from 'react-router-dom'


import { JOIN_GAME } from './queries';

const JoinGame = ({ gameId, history }) => (
  <Mutation
    mutation={JOIN_GAME}
    onCompleted={({ joinGame }) => {
      if (joinGame) {
        history.push(`/games/${joinGame.id}`);
      }
    }}
    onError={console.log}
  >
    {(joinGame, { loading, error }) => {
      if (loading) return <div>joining to game</div>;
      if (error) return <div>Error joining to game</div>;

      return (
        <Badge variant="warning" onClick={() => joinGame({ variables: { gameId } })}>Join</Badge>
      );
    }}
  </Mutation>
);

export default withRouter(JoinGame);
