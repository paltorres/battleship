/**
 * API routes.
 */
import { Application } from 'express';

import users from './api/controllers/users/controller';
import games from './api/controllers/games/controller';
import auth from './api/controllers/auth/controller';
import gameMods from './api/controllers/game-mods/controller';


export default function routes(app: Application): void {
  app.use('/api/battleships/users', users.routes);
  app.use('/api/battleships/auth', auth.routes);
  app.use('/api/battleships/games', games.routes);
  app.use('/api/battleships/mods', gameMods.routes);
};
