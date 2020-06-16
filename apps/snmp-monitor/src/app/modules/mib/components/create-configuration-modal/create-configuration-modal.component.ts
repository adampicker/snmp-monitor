import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { Store } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';
import { Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { MibService } from '../../service/mib.service';

@Component({
  selector: 'snmp-monitor-create-configuration-modal',
  templateUrl: './create-configuration-modal.component.html',
  styleUrls: ['./create-configuration-modal.component.scss']
})
export class CreateConfigurationModalComponent
  extends SimpleModalComponent<any, any>
  implements OnInit {
  configurationName: string = null;
  asDefault = true;
  selectedMibs: Mib[];

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this._eRef.nativeElement.contains(event.target)) {
      this.closeModal();
    }
  }

  constructor(
    private _eRef: ElementRef,
    private store: Store,
    private mibService: MibService
  ) {
    super();
  }
  ngOnInit(): void {}

  closeModal() {
    this.store.dispatch(new UpdateModalState({ modalName: '', value: {} }));
    this.close();
  }

  onPickOids() {
    if (!this.selectedMibs) {
      this.store.dispatch(
        new UpdateModalState({
          modalName: '',
          value: {
            select: true,
            configurationName: this.configurationName,
            asDefault: this.asDefault
          }
        })
      );
      this.closeModal();
    } else {
      this.mibService
        .saveConfiguration({
          configurationName: this.configurationName,
          defaultConfiguration: this.asDefault,
          mibs: this.selectedMibs
        })
        .subscribe(
          res => {
            this.openConfirmationModal(true);
          },
          err => {
            this.openConfirmationModal(false);
          }
        );
    }
  }

  private openConfirmationModal(success: boolean) {
    this.store.dispatch(
      new UpdateModalState({
        modalName: 'ConfirmationModalComponent',
        value: { success: success }
      })
    );
    this.close();
  }
}
