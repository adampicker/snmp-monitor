import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MibRoutingModule } from './mib-routing.module';
import { MibListComponent } from './pages/mib-list/mib-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MibHeaderComponent } from './components/mib-header/mib-header.component';
import { CreateConfigurationModalComponent } from './components/create-configuration-modal/create-configuration-modal.component';
import { NgxsModule } from '@ngxs/store';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    MibListComponent,
    MibHeaderComponent,
    CreateConfigurationModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    MibRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MibModule {}
