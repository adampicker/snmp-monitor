import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsApiService } from '../../service/clients-api.service';
import { Client } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { ConfigurationStore } from '../../../configuration/store/configuration.state';
import { Observable, Subject, forkJoin, VirtualTimeScheduler } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../../../configuration/service/configuration.service';
import { Configuration } from '../../../configuration/model/configuration.model';
import { EChartOption } from 'echarts';
import { DataStore } from 'apps/snmp-monitor/src/app/core/store/data.state';
import { Value } from 'apps/snmp-monitor/src/app/core/model/data. model';
import { OpenDataStream } from 'apps/snmp-monitor/src/app/core/store/data.action';
import { ClientDataService } from '../../service/client-data.service';
import { DataValues } from '../../model/data.model';

interface ChartData {
  name: number;
  value: number[];
}
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
  chartData: ChartData[] = [];
  updateOptions: any;
  chartOptions: any;

  timer = null;
  private now: Date;
  private value: number;

  @Select(DataStore.getData)
  data$: Observable<Value[]>;

  initialLoadDone$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientApiService: ClientsApiService,
    private configurationService: ConfigurationService,
    private store: Store,
    private clientDataService: ClientDataService
  ) {}

  ngOnInit(): void {
    //this.getClient();
    this.now = new Date(2020, 5, 27, 0, 0, 0, 0);
    this.value = Math.random() * 1000;
    this.clientDataService.oidToFetch = '1.3.6.1.4.1.2021.11.53.0';
    this.clientDataService.startStreaming();
    this.clientDataService.previousData
      .pipe(takeUntil(this.initialLoadDone$))
      .subscribe((data: DataValues[]) => {
        if (data) {
          this.chartData = data
            .filter(val => val.oid === '.' + this.clientDataService.oidToFetch)
            .map(
              val =>
                <ChartData>{
                  name: new Date(val.timestamp).getTime(),
                  value: [
                    new Date(val.timestamp).getTime(),
                    parseFloat(val.value)
                  ]
                }
            );
          this.initialLoadDone$.next();
          this.initialLoadDone$.unsubscribe();
          this.chartOptions = {
            title: {
              text: 'Dynamic Data + Time Axis'
            },
            tooltip: {
              trigger: 'axis',
              formatter: params => {
                params = params[0];
                const date = new Date(params.name);
                return (
                  date.getDate() +
                  '/' +
                  (date.getMonth() + 1) +
                  '/' +
                  date.getFullYear() +
                  ' ' +
                  date.getHours() +
                  ':' +
                  date.getMinutes() +
                  ':' +
                  date.getSeconds() +
                  ' : ' +
                  params.value[1]
                );
              },
              axisPointer: {
                animation: false
              }
            },
            xAxis: {
              type: 'time',
              splitLine: {
                show: false
              }
            },
            yAxis: {
              type: 'value',
              boundaryGap: ['20%', '20%'],
              splitLine: {
                show: false
              },
              scale: true
            },
            series: [
              {
                name: 'Mocking Data',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.chartData
              }
            ]
          };
        }
        this.clientDataService.currentData
          .pipe(takeUntil(this.destroy$))
          .subscribe((cur: DataValues) => {
            console.log('X');
            this.chartData.push({
              name: new Date(cur.timestamp).getTime(),
              value: [new Date(cur.timestamp).getTime(), parseFloat(cur.value)]
            });
            this.updateOptions = {
              series: [
                {
                  data: this.chartData
                }
              ]
            };
          });
      });
    this.loadClientData();
    //this.handleValuesStream();

    /* this.timer = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        //this.chartData.shift();
        this.chartData.push(this.randomData());
      }

      // update series data:
      this.updateOptions = {
        series: [
          {
            data: this.chartData
          }
        ]
      };
    }, 1000); */
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
    clearInterval(this.timer);
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
          this.loadConfigurationMibs();
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

  private handleValuesStream() {
    this.clientApiService
      .getValuesStream() //temp id
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.values) {
          let newVal = data.values.find(
            val => val.oid === '1.3.6.1.4.1.2021.11.53.0'
          );
          if (!newVal) return;
          this.updateData([
            new Date(newVal.timestamp).getTime(),
            parseFloat(newVal.value)
          ]);
          this.updateChart();
        }
      });
  }

  randomData() {
    this.now = new Date(this.now.getTime() + 24 * 3600 * 1000);
    this.now.setHours(12);
    this.value = this.value + Math.random() * 21 - 10;
    return {
      name: new Date().getTime(),
      value: [this.now.getTime(), Math.round(this.value)]
    };
  }

  private updateData(values: number[]) {
    console.log(values);
    this.chartData.push({ name: values[0], value: [values[0], values[1]] });
  }

  private updateChart() {
    this.updateOptions = {
      series: [
        {
          data: this.chartData
        }
      ]
    };
  }

  private loadConfigurationMibs() {
    this.clientApiService
      .getClientMibs(this.clientsInfo.configuration)
      .subscribe(res => {
        console.log(res);
      });
  }
}
