import { Request } from 'express';


interface reqUser {
  id: string,
}
export interface RequestWithUser extends Request {
  user: reqUser,
}
