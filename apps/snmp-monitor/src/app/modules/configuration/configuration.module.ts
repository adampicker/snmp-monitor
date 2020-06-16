import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationListComponent } from './pages/configuration-list/configuration-list.component';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigurationInfoModalComponent } from './components/configuration-info-modal/configuration-info-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { ConfigurationStore } from './store/configuration.state';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfigurationListComponent, ConfigurationInfoModalComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgxsModule.forFeature([ConfigurationStore])
  ]
})
export class ConfigurationModule {}
