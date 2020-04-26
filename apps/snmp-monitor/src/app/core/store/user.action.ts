import { User } from '../model/user.model';

export interface UserPayload {
  user: User;
}

export class UpdateUserData {
  static readonly type = '[User] Update users data';
  constructor(public payload: UserPayload) {}
}
