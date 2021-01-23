import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mib } from '../../shared/model/snmp.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MibApiService {
  constructor(private http: HttpClient) {}

  getAllMibs(): Observable<Mib[]> {
    return this.http.get<Mib[]>(`${environment.API_URL}/users/get-mibs`);
  }
}
