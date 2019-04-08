/**
 * Create user component.
 */
import React from 'react';
import { Mutation } from 'react-apollo';

import CreateGameForm from './create-game-form';
import { CREATE_GAME } from "./queries";

const CreateGame = (props) => (
  <Mutation
    mutation={CREATE_GAME}
    onCompleted={({ createGame: { id }}) => {
      if (id) {
        props.history.push(`/games/${id}`);
      }
    }}
    onError={console.log}
  >
    {(createGame, { loading, error }) => {
      // show spinner ????
      if (loading) return <div>loading</div>;
      if (error) return <p>An error occurred</p>;

      return <CreateGameForm createGame={createGame} />;
    }}
  </Mutation>
);

export default CreateGame;
