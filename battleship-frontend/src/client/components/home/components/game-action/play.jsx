import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Badge from 'react-bootstrap/Badge';


const PlayGame = ({ gameId }) => (
  <LinkContainer to={`games/${gameId}`}>
    <Badge variant="success">
      Play
    </Badge>
  </LinkContainer>
);

export default PlayGame;
