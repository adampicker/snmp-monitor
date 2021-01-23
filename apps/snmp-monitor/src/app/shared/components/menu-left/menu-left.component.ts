import { Component, OnInit, OnDestroy } from '@angular/core';
import { menuLeftConfig } from './menu-left.config';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { ModalStore } from '../../../core/store/modal.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SimpleModalComponent,
  SimpleModalService,
  SimpleModalOptions
} from 'ngx-simple-modal';
import { CreateConfigurationModalComponent } from '../../../modules/mib/components/create-configuration-modal/create-configuration-modal.component';
import { ConfirmationModalComponent } from '../../../modules/mib/components/confirmation-modal/confirmation-modal.component';
import { ConfigurationInfoModalComponent } from '../../../modules/configuration/components/configuration-info-modal/configuration-info-modal.component';

@Component({
  selector: 'snmp-monitor-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit, OnDestroy {
  @Select(ModalStore.getModalState)
  modalState$: Observable<{ modalName: string; value: {} }>;
  destroy$ = new Subject<boolean>();
  config = menuLeftConfig;
  modalOptions: Partial<SimpleModalOptions> = {
    closeOnEscape: true,
    closeOnClickOutside: true
  };
  constructor(
    private router: Router,
    private simpleModalService: SimpleModalService
  ) {}

  ngOnInit(): void {
    this.modalSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onMenuLeftClick(item: { key: string; label: string; icon: string }) {
    this.router.navigate(['../', item.key]);
  }

  modalSubscription() {
    this.modalState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      switch (state.modalName) {
        case 'CreateConfigurationModalComponent': {
          this.simpleModalService.addModal(
            CreateConfigurationModalComponent,
            {
              ...state.value
            },
            this.modalOptions
          );
          break;
        }
        case 'ConfirmationModalComponent': {
          this.simpleModalService.addModal(
            ConfirmationModalComponent,
            {
              ...state.value
            },
            this.modalOptions
          );
          break;
        }
        case 'ConfigurationInfoModalComponent': {
          this.simpleModalService.addModal(
            ConfigurationInfoModalComponent,
            {
              ...state.value
            },
            this.modalOptions
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
