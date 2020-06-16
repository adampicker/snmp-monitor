import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateModalState } from './modal.action';
import { Injectable } from '@angular/core';

interface ModalState {
  modalName: string;
  value: {};
}

@State<ModalState>({
  name: 'modal',
  defaults: {
    modalName: '',
    value: {}
  }
})
@Injectable()
export class ModalStore {
  constructor() {}

  @Selector()
  static getModalState(state: ModalState) {
    return state;
  }

  @Action(UpdateModalState)
  updateUserData(
    { patchState }: StateContext<ModalState>,
    { payload }: UpdateModalState
  ) {
    patchState({ modalName: payload.modalName, value: payload.value });
  }
}
