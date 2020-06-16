export interface UpdateModalPayload {
  modalName: string;
  value: {};
}

export class UpdateModalState {
  static readonly type = '[Modal] Update Modal state';
  constructor(public payload: UpdateModalPayload) {}
}
