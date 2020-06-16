import { User } from '../model/user.model';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateUserData } from './user.action';
import { Injectable } from '@angular/core';

interface UserState {
  user: User;
}

@State<UserState>({
  name: 'usertoken',
  defaults: {
    user: null
  }
})
@Injectable()
export class UserStore {
  constructor() {}

  @Selector()
  static getUser(state: UserState) {
    return state.user;
  }

  @Action(UpdateUserData)
  updateUserData(
    { patchState }: StateContext<UserState>,
    { payload }: UpdateUserData
  ) {
    patchState({ user: payload.user });
  }
}
