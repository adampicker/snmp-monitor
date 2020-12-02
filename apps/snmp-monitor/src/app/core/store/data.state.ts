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

  // @Action(OpenDataStream)
  // openDataStream(ctx: StateContext<DataState>, { payload }: OpenDataStream) {
  //   const state = ctx.getState();
  //   console.log('payload0');
  //   console.log(payload);
  //   this.clientsApiService
  //     .getValuesStream(payload.clientId)
  //     .subscribe((data: any) => {
  //       console.log(data);
  //       if (data && data.values) {
  //         /*         state.data.concat(data.values);
  //       console.log(state.data);
  //       ctx.patchState({ data: JSON.parse(JSON.stringify(state.data)) }); */
  //         ctx.setState(
  //           produce(draft => {
  //             data.values.forEach(el => {
  //               draft.data.push(el);
  //             });
  //           })
  //         );
  //       }
  //     });
  // }
}
