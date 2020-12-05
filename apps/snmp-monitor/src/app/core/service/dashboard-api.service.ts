import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../../modules/dashboard/components/model/model';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(
      `http://localhost:8080/users/get-dashboard-data`
    );
  }
}
