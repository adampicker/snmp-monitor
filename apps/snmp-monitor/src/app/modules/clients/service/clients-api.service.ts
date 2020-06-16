import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SseService } from '../../../core/service/sse.service';
import { Observable } from 'rxjs';
import { DataStream } from '../model/data.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsApiService {
  constructor(private http: HttpClient, private sseService: SseService) {}

  getAllClients() {
    return this.http.get<any>(`http://localhost:8080/users/get-clients`);
  }

  getClientDetails(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/users/get-client/${id}`);
  }

  getValuesStream(): Observable<DataStream> {
    return this.sseService.getSampleServerSentEvent('asd');
  }

  getClientMibs(configurationId: number) {
    return this.http.get<any>(
      `http://localhost:8080/users/get-mibs-in-configuration/${configurationId}`
    );
  }
}
