import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mib } from '../../../shared/model/snmp.model';
import { Observable, of } from 'rxjs';
import { ConfigurationSave } from '../model/configuration.model';
import { MibApiService } from '../../../core/service/mib-api.service';
import { ConfigurationApiService } from '../../../core/service/configuration-api.service';

const sampleMibs: Mib[] = [
  {
    oid: '.1.3.6.1.4.1.2021.10.1.3.1',
    unit: '1minload',
    description: 'average system load',
    telnetShortcut: '1 min load'
  },
  {
    oid: '.1.3.6.1.4.1.2021.10.1.3.2',
    unit: '5minload',
    description: 'average system load',
    telnetShortcut: '5 min load'
  },
  {
    oid: '.1.3.6.1.4.1.2021.10.1.3.3',
    unit: '15minload',
    description: 'average system load',
    telnetShortcut: '15 min load'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.53.0',
    unit: 'seconds',
    description: 'time when it is not being used by any program.',
    telnetShortcut: 'rawIdle'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.4.0',
    unit: 'kb',
    description: 'total size of free swap mem. in kb',
    telnetShortcut: 'freeswap'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.3.0',
    unit: 'kb',
    description: 'total size of swap mem. in kb.',
    telnetShortcut: 'totalswap'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.5.0',
    unit: 'kb',
    description: 'total ram size',
    telnetShortcut: 'totalram'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.6.0',
    unit: 'kb',
    description: 'total used ram',
    telnetShortcut: 'usedram'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.11.0',
    unit: 'kb',
    description: 'free ram',
    telnetShortcut: 'freeram'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.13.0',
    unit: 'kb',
    description: 'total shared ram',
    telnetShortcut: 'sharedram'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.14.0',
    unit: 'kb',
    description: 'total buffered ram',
    telnetShortcut: 'bufferedram'
  },
  {
    oid: '.1.3.6.1.4.1.2021.4.15.0',
    unit: 'kb',
    description: 'total cached memory',
    telnetShortcut: 'cachedmemory'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.2.1',
    unit: 'string',
    description: 'mount point',
    telnetShortcut: 'mountpoint'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.3.1',
    unit: 'kb',
    description: 'mount device for the partition',
    telnetShortcut: 'mountdevice'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.6.1',
    unit: 'kb',
    description: 'total partition size',
    telnetShortcut: 'totalpartition'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.7.1',
    unit: 'kb',
    description: 'Free disk space',
    telnetShortcut: 'freedisk'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.8.1',
    unit: 'kb',
    description: 'used disk space',
    telnetShortcut: 'useddisk'
  },
  {
    oid: '.1.3.6.1.4.1.2021.9.1.9.1',
    unit: 'percentage',
    description: 'Disk usage percentage',
    telnetShortcut: 'diskusagep'
  },
  {
    oid: '.1.3.6.1.2.1.25.1.1.0',
    unit: 'seconds',
    description: 'Uptime in seconds',
    telnetShortcut: 'uptime'
  },
  {
    oid: '.1.3.6.1.2.1.1.3.0',
    unit: 'seconds',
    description: 'snmp uptime in seconds',
    telnetShortcut: 'snmpuptime'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.9.0',
    unit: 'percentage',
    description: 'percentage of user CPU time',
    telnetShortcut: 'usercpu'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.50.0',
    unit: 'seconds',
    description: 'raw user cpu time',
    telnetShortcut: 'rawusercpu'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.10.0',
    unit: 'percentage',
    description: 'percentage of system cpu time',
    telnetShortcut: 'usercpu'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.52.0',
    unit: 'seconds',
    description: 'raw system cpu time',
    telnetShortcut: 'rawsystemcpu'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.11.0',
    unit: 'percentage',
    description: 'percentages of idle CPU time',
    telnetShortcut: 'idlecpu'
  },
  {
    oid: '.1.3.6.1.4.1.2021.11.51.0',
    unit: 'seconds',
    description: 'nice cpu time',
    telnetShortcut: 'nicecpu'
  }
];

@Injectable({
  providedIn: 'root'
})
export class MibService {
  readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
    'Acces-Control-Allow-Origin': '*'
  });
  constructor(
    private http: HttpClient,
    private mibApiService: MibApiService,
    private configurationApiService: ConfigurationApiService
  ) {}

  getAllMibs() {
    return this.mibApiService.getAllMibs();
  }

  saveConfiguration(configurationToSave: ConfigurationSave): Observable<any> {
    return this.configurationApiService.saveConfiguration(configurationToSave);
  }
}
