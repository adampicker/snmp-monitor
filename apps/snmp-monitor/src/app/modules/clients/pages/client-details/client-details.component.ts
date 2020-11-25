import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsApiService } from '../../service/clients-api.service';
import { Client, Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { ConfigurationStore } from '../../../configuration/store/configuration.state';
import { Observable, Subject, forkJoin, VirtualTimeScheduler } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../../../configuration/service/configuration.service';
import { Configuration } from '../../../configuration/model/configuration.model';
import { EChartOption } from 'echarts';
import { DataStore } from 'apps/snmp-monitor/src/app/core/store/data.state';
import { ClientDataService } from '../../service/client-data.service';

@Component({
  selector: 'snmp-monitor-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  clientsInfo: Client = null;
  configurations: Configuration[] = [];
  selectedConfiguration: Configuration = null;

  isLoading = true;

  destroy$ = new Subject<boolean>();
  btnLabel = 'Restart' || 'Update';

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientApiService: ClientsApiService,
    private configurationService: ConfigurationService,
    private store: Store,
    private clientDataService: ClientDataService
  ) {}

  ngOnInit(): void {
    this.getClient();
  }

  private getClient() {
    const id = parseFloat(this.activatedRoute.snapshot.paramMap.get('id'));
    this.clientApiService.getClientDetails(id).subscribe(client => {
      if (client) {
        this.clientsInfo = client;
        this.isLoading = false;
      }
    });
  }

  onResetClick() {
    console.log('reset');
    console.log(this.selectedConfiguration);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadClientData() {
    const id = parseFloat(this.activatedRoute.snapshot.paramMap.get('id'));
    const clients$ = this.clientApiService.getClientDetails(id);
    const configurations$ = this.configurationService.getAllConfigurations();
    forkJoin([clients$, configurations$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.clientsInfo = data[0];
          this.configurations = data[1];
          this.selectedConfiguration = this.resolveClientsConfiguration();
          this.isLoading = false;
        }
      });
  }

  private resolveClientsConfiguration() {
    const i = this.configurations.findIndex(
      conf => conf.id === this.clientsInfo.configuration
    );
    if (i === -1) return this.configurations[0];
    return this.configurations[i];
  }

  compareItems(i1, i2) {
    return i1 && i2 && i1.id === i2.id;
  }

  onConfigurationChange(event: any) {
    this.btnLabel =
      event.value.id === this.clientsInfo.configuration ? 'Restart' : 'Update';
  }
}
