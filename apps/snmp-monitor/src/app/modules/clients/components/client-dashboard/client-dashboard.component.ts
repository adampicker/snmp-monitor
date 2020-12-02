import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsApiService } from '../../../../core/service/clients-api.service';
import { Client, Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { ConfigurationStore } from '../../../configuration/store/configuration.state';
import {
  Observable,
  Subject,
  forkJoin,
  VirtualTimeScheduler,
  merge,
  of
} from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { map, takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../../../configuration/service/configuration.service';
import { Configuration } from '../../../configuration/model/configuration.model';
import { EChartOption } from 'echarts';
import { DataStore } from 'apps/snmp-monitor/src/app/core/store/data.state';
import { OpenDataStream } from 'apps/snmp-monitor/src/app/core/store/data.action';
import { ClientDataService } from '../../service/client-data.service';
import {
  DataStream,
  DataValues
} from 'apps/snmp-monitor/src/app/core/model/data.model';

import { chartOptions } from './chart-options';

interface ChartData {
  name: number;
  value: number[];
}

@Component({
  selector: 'snmp-monitor-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  @Input() client: Client;
  chartData: ChartData[] = [];
  allData = [];
  updateOptions: any;
  chartOptions: any; // chartOptions;

  timer = null;
  private now: Date;
  private value: number;

  @Select(DataStore.getData)
  data$: Observable<DataValues[]>;

  initialLoadDone$: Subject<boolean> = new Subject<boolean>();

  mibsCards: Mib[] = [];
  mibCardsValues: Observable<{ [key: string]: string }> = of({});
  public mibToFetch: Mib = null;

  destroy$ = new Subject<boolean>();
  changeMib$ = new Subject<boolean>();

  constructor(
    private clientsApiService: ClientsApiService,
    private store: Store,
    private clientDataService: ClientDataService
  ) {}

  ngOnInit(): void {
    //this.getClient();
    console.log(this.client);
    this.now = new Date(2020, 5, 27, 0, 0, 0, 0);
    this.value = Math.random() * 1000;
    this.loadConfigurationMibs();
    //this.store.dispatch(new OpenDataStream({ clientId: this.client.id }));
    //this.clientDataService.startStreaming();

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
    this.clientDataService.closeDataValuesStream();
    clearInterval(this.timer);
  }

  compareItems(i1, i2) {
    return i1 && i2 && i1.id === i2.id;
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

  private refreshChart() {
    console.log(this.updateOptions);
    this.updateOptions = {
      series: [
        {
          ...this.chartOptions.series,
          data: JSON.parse(JSON.stringify(this.chartData))
        }
      ]
    };
  }

  private loadConfigurationMibs() {
    this.clientsApiService
      .getClientMibs(this.client.configuration)
      .subscribe((res: Mib[]) => {
        if (res && Array.isArray(res)) {
          this.mibsCards = res;
          this.createMibCardsValues(res);
          this.mibToFetch = this.mibsCards[0];
          this.startDataStream();
        }
      });
  }

  onShowOnChart(mib: Mib) {
    this.mibToFetch = this.mibsCards.find(m => m.oid.includes(mib.oid));
    const data = this.allData.filter(value =>
      this.mibToFetch.oid.includes(value.oid)
    );
    console.log(data);
    this.chartOptions = {
      ...this.chartOptions,
      title: {
        text: this.mibToFetch.description
      }
    };
    this.cleanAndUpdateChart(data);
  }

  startDataStream() {
    let initialLoadDone = false;
    this.clientDataService
      .getDataValuesAsObservable() //temmp id)
      .subscribe((data: DataStream) => {
        if (data && data.values) {
          if (data.values.length === 0) return;
          else if (!initialLoadDone) {
            this.allData = data.values;
            //console.log(data.values);
            this.initChart(
              data.values
                .map(val => {
                  this.mibCardsValues[val.oid] = val.value;
                  return val;
                })
                .filter(
                  value => value.oid && value.oid.includes(this.mibToFetch.oid)
                )
            );
            initialLoadDone = true;
          } else {
            //console.log(data.values);
            data.values.forEach((val: DataValues) => {
              this.allData.push(val);
              this.mibCardsValues[val.oid] = val.value;
            });
            this.allData.push(data.values);
            this.updateChart(
              data.values.filter(value =>
                this.mibToFetch.oid.includes(value.oid)
              )
            );
          }
        }
      });
  }

  updateChart(values: DataValues[]) {
    values.forEach(val => {
      this.chartData.push({
        name: new Date(val.timestamp).getTime(),
        value: [new Date(val.timestamp).getTime(), parseFloat(val.value)]
      });
    });
    this.refreshChart();
  }

  cleanAndUpdateChart(data: DataValues[]) {
    this.chartData = data.map(
      val =>
        <ChartData>{
          name: new Date(val.timestamp).getTime(),
          value: [new Date(val.timestamp).getTime(), parseFloat(val.value)]
        }
    );
    this.refreshChart();
  }
  //  todo
  // ogarnac zaznaczanie mibow do nowej konfiguracji
  //  w updacie dodac dodawanie nowych
  //

  private initChart(data: DataValues[]) {
    console.log(data);
    if (data) {
      this.chartData = data.map(
        val =>
          <ChartData>{
            name: new Date(val.timestamp).getTime(),
            value: [new Date(val.timestamp).getTime(), parseFloat(val.value)]
          }
      );

      this.chartOptions = {
        title: {
          text: this.mibToFetch.description
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
  }
  createMibCardsValues(mibs: Mib[]) {
    mibs.forEach((m: Mib) => {
      this.mibCardsValues[m.oid] = '';
    });
  }
}
