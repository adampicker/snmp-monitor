import { Injectable } from '@angular/core';
import { ClientsApiService } from '../../../core/service/clients-api.service';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataStream, DataValues } from '../../../core/model/data.model';
import { Store, Select } from '@ngxs/store';
import { OpenDataStream } from '../../../core/store/data.action';
import { DataStore } from '../../../core/store/data.state';
import { Mib } from '../../../shared/model/snmp.model';
import { EventSourcePolifyll } from 'event-source-polyfill';
import { takeUntil } from 'rxjs/operators';
import { SseService } from '../../../core/service/sse.service';

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

  dataValuesStream: {
    eventSource: EventSourcePolifyll;
    events: BehaviorSubject<DataStream>;
  } = null;
  destroy$ = new Subject<boolean>();

  constructor(
    private clientsApiService: ClientsApiService,
    private store: Store,
    private sse: SseService
  ) {}

  // startStreaming() {
  //   //this.clientsApiService.getValuesStream().subscribe((data: DataStream) => {
  //   if (this.dataSubscribtion && !this.dataSubscribtion.closed) {
  //     this.dataSubscribtion.unsubscribe();
  //     console.log('unsu');
  //   }
  //   this.dataSubscribtion = this.data$.subscribe((data: DataValues[]) => {
  //     console.log(data);
  //     if (data && !this.initialLoadDone) {
  //       //this._data.push(data.values);
  //       this.previousData.next(
  //         data.filter(el => el.oid === this.mibToFetch.oid)
  //       );
  //       this.initialLoadDone = true;
  //     } else if (
  //       this.mibToFetch &&
  //       this.mibToFetch.oid.length > 0 &&
  //       this.initialLoadDone
  //     ) {
  //       data.forEach((el, index, array) => {
  //         if (el.oid === this.mibToFetch.oid) {
  //           this.currentData.next(el);
  //         }
  //         // this.cardsValues[el.oid] = el.value;
  //       });
  //     }
  //   });
  // }

  startDataValuesStream() {
    if (
      this.dataValuesStream &&
      this.dataValuesStream.eventSource &&
      this.dataValuesStream.eventSource.readyState !==
        EventSourcePolifyll.CLOSED
    )
      return;
    this.dataValuesStream = {
      eventSource: this.sse.getEventSource(
        `http://localhost:8080/users/data-stream`
      ),
      events: new BehaviorSubject<DataStream>(null)
    }; // tempid
    this.sse
      .getSampleServerSentEvent(this.dataValuesStream.eventSource)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dataValuesStream.events.next(data);
      });
  }

  getDataValuesAsObservable(): Observable<DataStream> {
    this.startDataValuesStream();
    return this.dataValuesStream.events.asObservable();
  }

  closeDataValuesStream() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.destroy$ = new Subject<boolean>();
    console.log(this.dataValuesStream.eventSource);
    this.sse.closeEventSource(this.dataValuesStream.eventSource);
    this.dataValuesStream = null;
  }
}
