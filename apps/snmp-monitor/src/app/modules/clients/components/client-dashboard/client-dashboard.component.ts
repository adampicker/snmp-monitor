import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input
} from '@angular/core';
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
import { Value } from 'apps/snmp-monitor/src/app/core/model/data. model';
import { OpenDataStream } from 'apps/snmp-monitor/src/app/core/store/data.action';
import { ClientDataService } from '../../service/client-data.service';
import { DataValues } from '../../model/data.model';

interface ChartData {
  name: number;
  value: number[];
}

@Component({
  selector: 'snmp-monitor-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  @Input() client: Client;
  chartData: ChartData[] = [];
  updateOptions: any;
  chartOptions: any;

  timer = null;
  private now: Date;
  private value: number;

  @Select(DataStore.getData)
  data$: Observable<Value[]>;

  initialLoadDone$: Subject<boolean> = new Subject<boolean>();

  mibsCards: Mib[] = [];
  destroy$ = new Subject<boolean>();

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
          console.log('dat');
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
          this.loadConfigurationMibs();
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
            console.log('x');
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    clearInterval(this.timer);
  }

  compareItems(i1, i2) {
    return i1 && i2 && i1.id === i2.id;
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
      .getClientMibs(this.client.configuration)
      .subscribe((res: Mib[]) => {
        if (res && Array.isArray(res)) this.mibsCards = res;
      });
  }
}
