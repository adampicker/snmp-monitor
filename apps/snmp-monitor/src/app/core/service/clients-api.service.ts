import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../shared/model/snmp.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsApiService {
  constructor(private http: HttpClient) {}

  getAllClients() {
    return this.http.get<any>(`http://localhost:8080/users/get-clients`);
  }

  getClientDetails(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/users/get-client/${id}`);
  }

  getClientMibs(configurationId: number) {
    return this.http.get<any>(
      `http://localhost:8080/users/get-mibs-in-configuration/${configurationId}`
    );
  }
  updateClientsConfiguration(
    clientId: number,
    configurationId: number
  ): Observable<Client> {
    return this.http.put<Client>(
      `http://localhost:8080/users/update-clients-configuration/${clientId}`,
      { configurationId: configurationId }
    );
  }
}
