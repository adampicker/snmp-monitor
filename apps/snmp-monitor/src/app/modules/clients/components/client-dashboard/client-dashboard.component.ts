import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClientsApiService } from '../../../../core/service/clients-api.service';
import { Client, Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { Observable, Subject, of } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DataStore } from 'apps/snmp-monitor/src/app/core/store/data.state';
import { ClientDataService } from '../../service/client-data.service';
import {
  DataStream,
  DataValues
} from 'apps/snmp-monitor/src/app/core/model/data.model';
import { graphic } from 'echarts';

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

  isLoading = true;

  constructor(
    private clientsApiService: ClientsApiService,
    private store: Store,
    private clientDataService: ClientDataService
  ) {}

  ngOnInit(): void {
    this.loadConfigurationMibs();
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
    this.chartOptions = {
      ...this.chartOptions,
      title: {
        text: this.mibToFetch.description,
        textStyle: {
          align: 'center',
          color: '#000',
          fontSize: 20
        },
        top: '5%',
        left: 'center'
      }
    };
    this.cleanAndUpdateChart(data);
  }

  startDataStream() {
    let initialLoadDone = false;
    this.clientDataService
      .getDataValuesAsObservable(this.client.id) //temmp id)
      .subscribe((data: DataStream) => {
        if (data && data.values) {
          if (data.values.length === 0) {
            this.isLoading = false;
            return;
          } else if (!initialLoadDone) {
            this.allData = data.values;
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
            this.isLoading = false;
          } else {
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

  private initChart(data: DataValues[]) {
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
          text: this.mibToFetch.description,
          textStyle: {
            align: 'center',
            color: '#000',
            fontSize: 20
          },
          top: '5%',
          left: 'center'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   formatter: params => {
        //     params = params[0];
        //     const date = new Date(params.name);
        //     return (
        //       date.getDate() +
        //       '/' +
        //       (date.getMonth() + 1) +
        //       '/' +
        //       date.getFullYear() +
        //       ' ' +
        //       date.getHours() +
        //       ':' +
        //       date.getMinutes() +
        //       ':' +
        //       date.getSeconds() +
        //       ' : ' +
        //       params.value[1]
        //     );
        //   },
        //   axisPointer: {
        //     animation: true
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0, 255, 233,0)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(255, 255, 255,1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 255, 233,0)'
                  }
                ],
                global: false
              }
            }
          }
        },
        xAxis: {
          type: 'time',
          axisLine: {
            show: true
          },
          splitArea: {
            //show: true,
            color: '#f00',
            lineStyle: {
              color: '#f00'
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: '#000'
            }
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
            name: 'Value:',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.chartData,
            symbol: 'circle',
            symbolSize: 20,
            lineStyle: {
              normal: {
                color: '#6c50f3'
                //shadowColor: 'rgba(0, 0, 0, .3)',
                //shadowBlur: 0,
                //shadowOffsetY: 5,
                //shadowOffsetX: 5
              }
            },
            label: {
              // show: true,
              position: 'top',
              textStyle: {
                color: '#6c50f3'
              }
            },
            itemStyle: {
              color: '#6c50f3',
              borderColor: '#fff',
              borderWidth: 3,
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2
            },
            areaStyle: {
              normal: {
                color: new graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(108,80,243,0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(108,80,243,0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(108,80,243, 0.9)',
                shadowBlur: 20
              }
            }
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
