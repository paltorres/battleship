import React from 'react';
import { Mutation } from 'react-apollo';

import { DELETE_GAME } from './queries';
import { MY_GAMES } from '../queries';
import Badge from "react-bootstrap/Badge";

const DeleteGame = ({ gameId }) => (
  <Mutation
    mutation={DELETE_GAME}
    update={(cache, { data: { deleteGame } }) => {
      if (deleteGame.ok) {
        const { myGames } = cache.readQuery({ query: MY_GAMES });
        cache.writeQuery({
          query: MY_GAMES,
          data: { myGames: myGames.filter(g => g.id !== gameId) }
        });
      }
    }}
    onError={console.log}
  >
    {(deleteGame, { loading, error }) => {
      if (loading) return <div>Deleting the game...</div>;
      if (error) return <div>Error deleting the game, try again later...</div>;

      return (
        <Badge variant="danger" onClick={() => deleteGame({ variables: { gameId }})}>Delete</Badge>
      );
    }}
  </Mutation>
);

export default DeleteGame;
