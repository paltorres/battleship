/**
 * API routes.
 */
import { Router, Request, Response, Application } from 'express';
import examplesRouter from './api/controllers/examples/router';

import users from './api/controllers/users/controller';
import auth from './api/controllers/auth/controller';

function noopController(req: Request, res: Response): void {
  res.status(200).send('noop controller');
}

export default function routes(app: Application): void {
  app.use('/api/battleships/users', users.routes);
  app.use('/api/battleships/auth', auth.routes);
  app.use('/api/battleships/games', Router().get('/', noopController));


  app.use('/api/v1/examples', examplesRouter);
};
