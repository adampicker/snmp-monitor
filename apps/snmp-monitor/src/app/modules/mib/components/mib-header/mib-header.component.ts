import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';
import { yearsPerPage } from '@angular/material/datepicker';

@Component({
  selector: 'snmp-monitor-mib-header',
  templateUrl: './mib-header.component.html',
  styleUrls: ['./mib-header.component.scss']
})
export class MibHeaderComponent implements OnInit {
  @Input()
  buttonLabel: 'Create new configuration' | 'Add selected OIDs';

  constructor(private store: Store) {}

  ngOnInit(): void {}

  onHeaderButton(event: any) {
    event.stopPropagation();
    if (this.buttonLabel === 'Create new configuration')
      this.store.dispatch(
        new UpdateModalState({
          modalName: 'CreateConfigurationModalComponent',
          value: {}
        })
      );
    else if (this.buttonLabel === 'Add selected OIDs')
      this.store.dispatch(
        new UpdateModalState({
          modalName: 'CreateConfigurationModalComponent',
          value: {
            afterAdd: true
          }
        })
      );
  }
}
