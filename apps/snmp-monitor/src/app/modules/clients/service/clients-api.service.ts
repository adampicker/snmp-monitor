import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientsApiService {
  constructor(private http: HttpClient) {}

  getAllClients() {
    return this.http.get<any>(`http://localhost:8080/users/get-clients`);
  }
}
