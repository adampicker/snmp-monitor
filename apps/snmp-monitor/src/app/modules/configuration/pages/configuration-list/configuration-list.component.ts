import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { Configuration } from '../../model/configuration.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Store, Select, Selector } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';
import { ModalStore } from 'apps/snmp-monitor/src/app/core/store/modal.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SseService } from 'apps/snmp-monitor/src/app/core/service/sse.service';
import { ConfigurationStore } from '../../store/configuration.state';
import { LoadAllConfigurations } from '../../store/configuration.action';

@Component({
  selector: 'snmp-monitor-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.scss']
})
export class ConfigurationListComponent implements OnInit {
  @Select(ModalStore.getModalState)
  modalState$: Observable<{ modalName: string; value: any }>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  public dataSource = new MatTableDataSource<Configuration>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Select(ConfigurationStore.getConfigurations)
  configurations$: Observable<Configuration[]>;

  isLoading = true;
  defaultConfigurationId: number;

  constructor(
    private configurationService: ConfigurationService,
    private store: Store,
    private toastrService: ToastrService,
    private sseService: SseService
  ) {}

  public displayedColumns = [
    'id',
    'client',
    'configurationName',
    'mib',
    'delete'
  ];

  tableContent: Configuration[] = [
    {
      id: 100,
      configurationName: 'konfiguracja1',
      defaultConfiguration: false,
      mib: [
        {
          oid: '.1.3.6.1.4.1.2021.10.1.3.3',
          unit: '15minload',
          description: 'average system load',
          telnetShortcut: '15 min load'
        },
        {
          oid: '.1.3.6.1.4.1.2021.10.1.3.2',
          unit: '5minload',
          description: 'average system load',
          telnetShortcut: '5 min load'
        },
        {
          oid: '.1.3.6.1.4.1.2021.11.53.0',
          unit: 'seconds',
          description: 'time when it is not being used by any program.',
          telnetShortcut: 'rawIdle'
        },
        {
          oid: '.1.3.6.1.4.1.2021.10.1.3.1',
          unit: '1minload',
          description: 'average system load',
          telnetShortcut: '1 min load'
        }
      ],
      client: 100
    },
    {
      id: 101,
      configurationName: 'konfiguracja2',
      defaultConfiguration: true,
      mib: [
        {
          oid: '.1.3.6.1.4.1.2021.11.53.0',
          unit: 'seconds',
          description: 'time when it is not being used by any program.',
          telnetShortcut: 'rawIdle'
        }
      ],
      client: 103
    }
  ];

  ngOnInit(): void {
    this.dataSource.data = [];
    this.refreshList();

    this.modalState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state && state.modalName === '' && state.value.refresh === true) {
        this.refreshList();
      }
    });
  }

  getDefaultConfigurationId() {
    const item = this.dataSource.data.find(row => row.defaultConfiguration);
    if (item) this.defaultConfigurationId = item.id;
    else this.defaultConfigurationId = 0;
  }

  onRowSelection(row: Configuration) {
    this.store.dispatch(
      new UpdateModalState({
        modalName: 'ConfigurationInfoModalComponent',
        value: { configuration: row }
      })
    );
  }

  refreshList() {
    this.isLoading = true;
    this.configurationService.getAllConfigurations().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.getDefaultConfigurationId();
      this.isLoading = false;
    });
  }

  onDelete(event: Event, confToDelete: Configuration) {
    event.stopPropagation();
    console.log(confToDelete);
    this.configurationService.deleteConfiguration(confToDelete.id).subscribe(
      res => {
        this.toastrService.success('Configuration deleted successfully', 'dd');
        this.refreshList();
      },
      err => {
        this.toastrService.error(
          'Configuration has not been deleted',
          'Try again later on'
        );
      }
    );
  }
}
