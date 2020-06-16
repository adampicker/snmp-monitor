import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';

@Component({
  selector: 'snmp-monitor-clients-list-header',
  templateUrl: './clients-list-header.component.html',
  styleUrls: ['./clients-list-header.component.scss']
})
export class ClientsListHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
