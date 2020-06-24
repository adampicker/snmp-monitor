import { Injectable } from '@angular/core';
import { ClientsApiService } from './clients-api.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { DataStream, DataValues } from '../model/data.model';

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  private _data: any[] = [];
  public oidToFetch: string = null;
  initialLoadDone = false;

  public previousData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    null
  );
  public currentData: Subject<DataValues> = new Subject<any>();

  constructor(private clientsApiService: ClientsApiService) {}

  startStreaming() {
    this.clientsApiService.getValuesStream().subscribe((data: DataStream) => {
      console.log(data.values.length);
      if (data && data.values && !this.initialLoadDone) {
        this._data.push(data.values);
        if (!this.initialLoadDone) this.previousData.next(data.values);
        this.initialLoadDone = true;
        //console.log('prev');
      } else if (
        this.oidToFetch &&
        this.oidToFetch.length > 0 &&
        this.initialLoadDone
      ) {
        data.values.forEach(el => {
          //console.log(el);
          if (el.oid === this.oidToFetch) {
            this.currentData.next(el);
          }
        });
      }
    });
  }
}
