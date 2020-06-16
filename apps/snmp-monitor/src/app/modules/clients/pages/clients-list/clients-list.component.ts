import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { columns, TableColumn } from './client-list.config';
import { ClientsApiService } from '../../service/clients-api.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { Router } from '@angular/router';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { DataStore } from 'apps/snmp-monitor/src/app/core/store/data.state';
import { Observable, Subject } from 'rxjs';
import { Value } from 'apps/snmp-monitor/src/app/core/model/data. model';
import { OpenDataStream } from 'apps/snmp-monitor/src/app/core/store/data.action';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'snmp-monitor-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientsListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  public dataSource = new MatTableDataSource<Client>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = [
    'id',
    'macAddress',
    'type',
    'port',
    'pid',
    'userName',
    'status'
  ];
  isLoading = true;

  constructor(
    private clientsApiService: ClientsApiService,
    private router: Router,
    private store: Store
  ) {}

  tableContent = [
    {
      id: 100,
      macAddress: 'samplemac',
      status: 0,
      type: 'desktop',
      port: '1601',
      pid: 323,
      userName: 'snmp'
    },
    {
      id: 101,
      macAddress: 'samplemac2',
      status: 1,
      type: 'desktop',
      port: '1601',
      pid: 323,
      userName: 'snmp'
    },
    {
      id: 102,
      macAddress: 'samplemac3',
      status: 1,
      type: 'desktop',
      port: '1621',
      pid: 323,
      userName: 'snmp4'
    },
    {
      id: 103,
      macAddress: 'samplemac4',
      status: 2,
      type: 'desktop',
      port: '1621',
      pid: 323,
      userName: 'snmp5'
    }
  ];
  defaultColumns: TableColumn[] = columns;
  some: any;
  ngOnInit(): void {
    this.dataSource.data = [];
    this.clientsApiService.getAllClients().subscribe(clients => {
      this.dataSource.data = clients;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onRowSelection(row: Client) {
    this.router.navigate(['clients', 'details', row.id]);
  }
}
