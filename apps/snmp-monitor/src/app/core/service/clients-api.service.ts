import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../shared/model/snmp.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsApiService {
  constructor(private http: HttpClient) {}

  getAllClients() {
    return this.http.get<any>(`${environment.API_URL}/users/get-clients`);
  }

  getClientDetails(id: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/users/get-client/${id}`);
  }

  getClientMibs(configurationId: number) {
    return this.http.get<any>(
      `${environment.API_URL}/users/get-mibs-in-configuration/${configurationId}`
    );
  }
  updateClientsConfiguration(
    clientId: number,
    configurationId: number
  ): Observable<Client> {
    return this.http.put<Client>(
      `${environment.API_URL}/users/update-clients-configuration/${clientId}`,
      { configurationId: configurationId }
    );
  }
}
