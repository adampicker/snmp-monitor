import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { MibService } from '../../service/mib.service';
import { Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Select, Store } from '@ngxs/store';
import { ModalStore } from 'apps/snmp-monitor/src/app/core/store/modal.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UpdateModalState } from 'apps/snmp-monitor/src/app/core/store/modal.action';

@Component({
  selector: 'snmp-monitor-mib-list',
  templateUrl: './mib-list.component.html',
  styleUrls: ['./mib-list.component.scss']
})
export class MibListComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<Mib>();
  public displayedColumns = ['oid', 'description', 'telnetShortcut', 'unit'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = true;

  @Select(ModalStore.getModalState)
  modalState$: Observable<{ modalName: string; value: any }>;
  modalValue: any;

  destroy$ = new Subject<boolean>();

  headerButtonLabel: 'Create new configuration' | 'Add selected OIDs' =
    'Create new configuration';
  selectedMibs: Mib[] = [];

  constructor(private mibService: MibService, private store: Store) {}

  ngOnInit(): void {
    this.mibService.getAllMibs().subscribe(res => {
      this.isLoading = false;
      this.dataSource.data = res;
    });

    this.modalState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state && state.value && state.value.select) {
        this.displayedColumns.unshift('select');
        this.headerButtonLabel = 'Add selected OIDs';
        console.log(state.value);
        this.modalValue = { ...state.value };
      } else if (state.modalName === 'ConfirmationModalComponent') {
        this.selectedMibs = [];
        this.displayedColumns.splice(0, 1);
        this.headerButtonLabel = 'Create new configuration';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  rowSelected(event: any, element: Mib) {
    if (event.target.checked) this.selectedMibs.push(element);
    else {
      const i = this.selectedMibs.findIndex(mib => mib.oid === element.oid);
      if (i !== -1) this.selectedMibs.splice(i, 1);
    }
    console.log(this.selectedMibs);
  }

  onHeaderButton(event: any) {
    event.stopPropagation();
    if (this.headerButtonLabel === 'Create new configuration')
      this.store.dispatch(
        new UpdateModalState({
          modalName: 'CreateConfigurationModalComponent',
          value: {}
        })
      );
    else if (this.headerButtonLabel === 'Add selected OIDs') {
      console.log(this.modalValue);
      this.store.dispatch(
        new UpdateModalState({
          modalName: 'CreateConfigurationModalComponent',
          value: {
            configurationName: this.modalValue.configurationName,
            asDefault: this.modalValue.asDefault,
            afterAdd: true,
            selectedMibs: this.selectedMibs
          }
        })
      );
    }
  }

  onClick() {}
}
