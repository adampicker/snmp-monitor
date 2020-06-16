import { State, Selector, Action, StateContext } from '@ngxs/store';
import { UpdateModalState } from './modal.action';
import { Injectable } from '@angular/core';
import { OpenDataStream } from './data.action';
import { SseService } from '../service/sse.service';
import { Value } from '../model/data. model';
import {
  patch,
  append,
  removeItem,
  insertItem,
  updateItem
} from '@ngxs/store/operators';

interface DataState {
  data: Value[];
}

@State<DataState>({
  name: 'data',
  defaults: {
    data: []
  }
})
@Injectable()
export class DataStore {
  constructor(private sseService: SseService) {}

  @Selector()
  static getClientsData(clientId: number) {
    console.log(clientId);
    return (state: DataState) => {
      state.data.forEach(el => {
        console.log(el.clientId);
      });
      return state.data.filter(el => el.clientId === clientId);
    };
  }
  @Selector()
  static getData(state: DataState) {
    return state.data;
  }

  @Action(OpenDataStream)
  openDataStream({ patchState }: StateContext<DataState>) {
    this.sseService
      .getSampleServerSentEvent('http://localhost:8080/users/data-stream')
      .subscribe(data => {
        if (data && data.values) patchState({ data: data.values });
      });
  }
}
