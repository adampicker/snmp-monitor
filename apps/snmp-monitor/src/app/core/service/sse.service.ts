import { Injectable, NgZone } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { EventSourcePolyfill } from 'event-source-polyfill';
import {
  initialLoad,
  first_row,
  second_row,
  third_row,
  fourth_row,
  fifth_row,
  sixth_row,
  seventh_row,
  eighth_row,
  ninth_row
} from './sample-data-load';
import { AuthenticationService } from '../auth/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class SseService {
  readonly headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    // accept: '*/*',
    // 'Acces-Control-Allow-Origin': '*'
  });

  SAMPLE_LIVE_DATA: { [key: string]: { values: any[] } } = {};

  constructor(
    private _zone: NgZone,
    private authenticationService: AuthenticationService
  ) {}

  getServerSentEvent(eventSource: EventSourcePolyfill): Observable<any> {
    const httpOptions = {
      headers: this.headers
    };

    return new Observable(observer => {
      console.log('openning event source');
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };
      eventSource.onerror = error => {
        this._zone.run(() => {
          console.log(error);
        });
      };
    });
  }
  getEventSource(url: string): EventSourcePolyfill {
    return new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${
          this.authenticationService.getCurrentUserValue().token
        }`
      }
    });
  }

  public getSampleServerSentEvent(url: string) {
    this.SAMPLE_LIVE_DATA['initialLoad'] = initialLoad;
    this.SAMPLE_LIVE_DATA['first_row'] = first_row;
    this.SAMPLE_LIVE_DATA['second_row'] = second_row;
    this.SAMPLE_LIVE_DATA['third_row'] = third_row;
    this.SAMPLE_LIVE_DATA['fourth_row'] = fourth_row;
    this.SAMPLE_LIVE_DATA['fifth_row'] = fifth_row;
    this.SAMPLE_LIVE_DATA['sixth_row'] = sixth_row;
    this.SAMPLE_LIVE_DATA['seventh_row'] = seventh_row;
    this.SAMPLE_LIVE_DATA['eighth_row'] = eighth_row;
    this.SAMPLE_LIVE_DATA['ninth_row'] = ninth_row;
    return Observable.create(observer => {
      const keys = Object.keys(this.SAMPLE_LIVE_DATA);
      const items = keys.length;
      timer(items, 2000).subscribe(sequence => {
        if (sequence > items) observer.next({ values: [] });
        observer.next(this.SAMPLE_LIVE_DATA[keys[sequence]]);
      });
    });
  }

  closeEventSource(eventSource: EventSourcePolyfill) {
    if (eventSource) eventSource.close();
  }
}
