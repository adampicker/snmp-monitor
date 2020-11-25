import { Injectable } from '@angular/core';
import { ClientsApiService } from './clients-api.service';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataStream, DataValues } from '../../../core/model/data.model';
import { Store, Select } from '@ngxs/store';
import { OpenDataStream } from '../../../core/store/data.action';
import { DataStore } from '../../../core/store/data.state';
import { Mib } from '../../../shared/model/snmp.model';

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  private _data: any[] = [];
  public mibToFetch: Mib = null;
  initialLoadDone = false;

  @Select(DataStore.getData)
  data$: Observable<DataValues[]>;
  dataSubscribtion: Subscription;

  public previousData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    null
  );
  public currentData: Subject<DataValues> = new Subject<any>();

  constructor(
    private clientsApiService: ClientsApiService,
    private store: Store
  ) {}

  startStreaming() {
    //this.clientsApiService.getValuesStream().subscribe((data: DataStream) => {
    if (this.dataSubscribtion && !this.dataSubscribtion.closed) {
      this.dataSubscribtion.unsubscribe();
      console.log('unsu');
    }
    this.dataSubscribtion = this.data$.subscribe((data: DataValues[]) => {
      console.log(data);
      if (data && !this.initialLoadDone) {
        //this._data.push(data.values);
        this.previousData.next(
          data.filter(el => el.oid === this.mibToFetch.oid)
        );
        this.initialLoadDone = true;
      } else if (
        this.mibToFetch &&
        this.mibToFetch.oid.length > 0 &&
        this.initialLoadDone
      ) {
        data.forEach((el, index, array) => {
          if (el.oid === this.mibToFetch.oid) {
            this.currentData.next(el);
          }
          // this.cardsValues[el.oid] = el.value;
        });
      }
    });
  }
}
