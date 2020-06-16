import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../model/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
    'Acces-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient) {}

  getAllConfigurations(): Observable<Configuration[]> {
    return this.http.get<any>(`http://localhost:8080/users/configurations`);
  }

  updateConfiguration(configurationToUpdate: Configuration): Observable<any> {
    return this.http.put<any>(
      `http://localhost:8080/users/update-configuration`,
      configurationToUpdate
    );
  }

  deleteConfiguration(configurationId: number): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:8080/users/delete-configuration/${configurationId}`
    );
  }
}
