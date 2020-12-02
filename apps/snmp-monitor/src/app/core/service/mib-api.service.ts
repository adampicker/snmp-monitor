import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mib } from '../../shared/model/snmp.model';

@Injectable({
  providedIn: 'root'
})
export class MibApiService {
  constructor(private http: HttpClient) {}

  getAllMibs(): Observable<Mib[]> {
    return this.http.get<Mib[]>('http://localhost:8080/users/get-mibs');
  }
}
