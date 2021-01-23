import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationSave } from '../../modules/mib/model/configuration.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationApiService {
  constructor(private http: HttpClient) {}

  saveConfiguration(configurationToSave: ConfigurationSave): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}/users/add-configuration`,
      configurationToSave
    );
  }
}
