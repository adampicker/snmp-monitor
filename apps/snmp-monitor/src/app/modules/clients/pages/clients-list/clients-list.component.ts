import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { columns, TableColumn } from './client-list.config';
import { ClientsApiService } from '../../service/clients-api.service';

@Component({
  selector: 'snmp-monitor-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  constructor(private clientsApiService: ClientsApiService) {}

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
  ngOnInit(): void {
    this.clientsApiService.getAllClients().subscribe(clients => {
      this.tableContent = clients;
    });
  }
}
