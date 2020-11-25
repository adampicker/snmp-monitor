export interface OpenStreamPayload {
  clientId: number;
}

export class OpenDataStream {
  static readonly type = '[Data] Open Data stream';
  constructor(public payload: OpenStreamPayload) {}
}
