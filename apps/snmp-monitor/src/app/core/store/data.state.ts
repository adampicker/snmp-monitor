import { State, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SseService } from '../service/sse.service';
import { DataValues } from '../model/data.model';

import { ClientsApiService } from '../../core/service/clients-api.service';

interface DataState {
  data: DataValues[];
}

@State<DataState>({
  name: 'data',
  defaults: {
    data: []
  }
})
@Injectable()
export class DataStore {
  constructor(
    private sseService: SseService,
    private clientsApiService: ClientsApiService
  ) {}

  @Selector()
  static getClientsData(clientId: number) {
    return (state: DataState) => {
      state.data.forEach(el => {});
      return state.data.filter(el => el.clientId === clientId);
    };
  }
  @Selector()
  static getData(state: DataState) {
    return state.data;
  }
}
