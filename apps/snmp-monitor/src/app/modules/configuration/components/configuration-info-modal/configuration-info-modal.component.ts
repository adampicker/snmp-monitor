import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { Configuration } from '../../model/configuration.model';
import { Store } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';
import { Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../../service/configuration.service';
import { MibApiService } from 'apps/snmp-monitor/src/app/core/service/mib-api.service';

@Component({
  selector: 'snmp-monitor-configuration-info-modal',
  templateUrl: './configuration-info-modal.component.html',
  styleUrls: ['./configuration-info-modal.component.scss']
})
export class ConfigurationInfoModalComponent
  extends SimpleModalComponent<any, any>
  implements OnInit {
  configuration: Configuration = null;
  configurationView: { mib: Mib; checked: boolean }[] = [];
  isLoading = true;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private configurationService: ConfigurationService,
    private mibApiService: MibApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.parseConfigurationToView(this.configuration);
  }

  closeModal() {
    this.store.dispatch(new UpdateModalState({ modalName: '', value: {} }));
    this.close();
  }

  onSave() {
    this.isLoading = true;
    this.configuration.mib = [];
    this.configurationView.forEach(element => {
      if (element.checked) this.configuration.mib.push(element.mib);
    });
    this.configurationService.updateConfiguration(this.configuration).subscribe(
      res => {
        this.toastr.success('Configuration updated sucessfully', '');
        this.store.dispatch(
          new UpdateModalState({ modalName: '', value: { refresh: true } })
        );
        this.closeModal();
      },
      err => {
        this.toastr.error(
          'Configuration has not been updated',
          'Try again later'
        );
        this.store.dispatch(
          new UpdateModalState({ modalName: '', value: { refresh: true } })
        );
        this.closeModal();
      }
    );
  }

  private parseConfigurationToView(configuration: Configuration) {
    this.mibApiService.getAllMibs().subscribe((res: Mib[]) => {
      res.forEach((mib: Mib) => {
        const i = configuration.mib.findIndex(
          mibInConf => mibInConf.oid === mib.oid
        );
        this.configurationView.push({
          mib: mib,
          checked: i !== -1 ? true : false
        });
        this.isLoading = false;
      });
    });
  }
}
