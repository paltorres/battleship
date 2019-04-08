import React from 'react';

import Badge from 'react-bootstrap/Badge';


const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'in_game':
      return 'success';
    case 'waiting_for_opponent':
      return 'secondary';
    case 'finished':
      return 'info';
  }
};

const GameStatus = ({ availableActions, status, fleetConfig }) => (
  <div>
    <h6><Badge variant={getStatusBadgeVariant(status)}>{status}</Badge></h6>
    {fleetConfig.map(({ type, quantity }) => (
      <span className="mr-3" key={`${type}__${quantity}`}>{type}: <Badge variant="primary">{quantity}</Badge></span>
    ))}
    <div>{availableActions}</div>
  </div>
);

export default GameStatus
