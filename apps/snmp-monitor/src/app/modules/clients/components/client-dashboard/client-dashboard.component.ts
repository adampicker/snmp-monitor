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
import {
  Observable,
  Subject,
  forkJoin,
  VirtualTimeScheduler,
  merge
} from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
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
  allData = [];
  updateOptions: any;
  chartOptions: any;

  timer = null;
  private now: Date;
  private value: number;

  @Select(DataStore.getData)
  data$: Observable<DataValues[]>;

  initialLoadDone$: Subject<boolean> = new Subject<boolean>();

  mibsCards: Mib[] = [];
  mibCardsValues: { [key: string]: string } = {};
  public mibToFetch: Mib = null;

  destroy$ = new Subject<boolean>();
  changeMib$ = new Subject<boolean>();

  cardsValues: { [key: string]: string } = {};

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

  private updateData(values: number[]) {
    this.chartData.push({ name: values[0], value: [values[0], values[1]] });
  }

  private refreshChart() {
    this.updateOptions = {
      series: [
        {
          data: this.chartData
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
    this.mibToFetch = this.mibsCards.find(m => m.oid === mib.oid);
    this.chartData = this.allData.filter(
      value => value.oid === this.mibToFetch.oid
    );
    console.log('after flters');
    console.log(this.chartData);
    this.refreshChart();
  }

  startDataStream() {
    let initialLoadDone = false;
    this.clientsApiService
      .getValuesStream(1) //temmp id)
      .subscribe((data: DataStream) => {
        if (data.values) {
          if (data.values.length === 0) return;
          else if (!initialLoadDone) {
            this.allData = data.values;
            this.initChart(
              data.values.filter(value => value.oid === this.mibToFetch.oid)
            );
            initialLoadDone = true;
          } else {
            this.allData.push(data.values);
            this.updateChart(
              data.values.filter(value => value.oid === this.mibToFetch.oid)
            );
          }
        }
      });
  }

  updateChart(values: DataValues[]) {
    console.log('cur');
    values.forEach(val => {
      this.chartData.push({
        name: new Date(val.timestamp).getTime(),
        value: [new Date(val.timestamp).getTime(), parseFloat(val.value)]
      });
    });
    this.refreshChart();
  }
  // TODO
  // NIE DZIAŁA DRUGI RAZ OTWARTY STREAM
  // NIE DZIAŁA ZMIANA MIB'A
  private initChart(data: DataValues[]) {
    console.log(data);
    if (data) {
      this.chartData = data
        //  .filter(val => val.oid === '.' + this.clientDataService.oidToFetch)
        .map(
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
      this.cardsValues[m.oid] = 'Unavailable';
    });
    console.log(this.cardsValues);
  }
}
