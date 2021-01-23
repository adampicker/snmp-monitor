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
import { environment } from '../../../../environments/environment';

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

  startDataValuesStream(clientId: number) {
    if (
      this.dataValuesStream &&
      this.dataValuesStream.eventSource &&
      this.dataValuesStream.eventSource.readyState !==
        EventSourcePolifyll.CLOSED
    )
      return;
    this.dataValuesStream = {
      eventSource: this.sse.getEventSource(
        `${environment.API_URL}users/data-stream/${clientId}`
      ),
      events: new BehaviorSubject<DataStream>(null)
    };
    this.sse
      .getServerSentEvent(this.dataValuesStream.eventSource)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dataValuesStream.events.next(data);
      });
  }

  getDataValuesAsObservable(clientId: number): Observable<DataStream> {
    this.startDataValuesStream(clientId);
    return this.dataValuesStream.events.asObservable();
  }

  closeDataValuesStream() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.destroy$ = new Subject<boolean>();
    this.sse.closeEventSource(this.dataValuesStream.eventSource);
    this.dataValuesStream = null;
  }
}
