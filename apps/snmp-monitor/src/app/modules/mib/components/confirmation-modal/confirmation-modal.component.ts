import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { Store } from '@ngxs/store';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';

@Component({
  selector: 'snmp-monitor-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent extends SimpleModalComponent<any, any>
  implements OnInit {
  success: boolean;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) this.closeModal();
  }
  constructor(private store: Store, private eRef: ElementRef) {
    super();
  }

  ngOnInit(): void {}

  closeModal() {
    this.store.dispatch(new UpdateModalState({ modalName: '', value: {} }));
    this.close();
  }
}
