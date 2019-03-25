import { Request } from "express";
import { BaseUser } from "../api/types/user";


declare global {
  namespace Express {
    interface Request {
      user: BaseUser;
    }
  }
}


export class BattleshipRequest extends Request {
}
