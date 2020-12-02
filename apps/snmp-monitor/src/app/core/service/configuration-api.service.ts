import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationSave } from '../../modules/mib/model/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationApiService {
  constructor(private http: HttpClient) {}

  saveConfiguration(configurationToSave: ConfigurationSave): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/users/add-configuration`,
      configurationToSave
    );
  }
}
