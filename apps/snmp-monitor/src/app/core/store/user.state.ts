import { User } from '../model/user.model';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateUserData } from './user.action';

interface UserState {
  user: User;
}

@State<UserState>({
  name: 'usertoken',
  defaults: {
    user: null
  }
})
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
