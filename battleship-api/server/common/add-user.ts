/**
 * Add the user to request.
 */
import { Response, NextFunction } from 'express';

export default function addUser(req: any, res: Response, next: NextFunction) {
  const id = req.headers['x-user-id'];

  req.user = id ? { id } : {};
  next();
}
