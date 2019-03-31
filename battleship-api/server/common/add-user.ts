/**
 * Add the user to request.
 */
import { Response, NextFunction } from 'express';
import objOf from 'ramda/src/objOf';
import path from 'ramda/src/path';

import { RequestWithUser } from '../api/types';

export default function addUser(req: RequestWithUser, res: Response, next: NextFunction) {
  const id = path(['headers', 'x-user-id'], req);

  req.user = objOf('id', id);
  next();
}
