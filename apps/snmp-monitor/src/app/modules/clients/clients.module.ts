import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { ClientsListRoutingModule } from './clients-list-routing.module';
import { ClientsListHeaderComponent } from './components/clients-list-header/clients-list-header.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientDetailsComponent } from './pages/client-details/client-details.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../shared/shared.module';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';

@NgModule({
  declarations: [
    ClientsListComponent,
    ClientsListHeaderComponent,
    ClientDetailsComponent,
    ClientDashboardComponent
  ],
  imports: [
    CommonModule,
    ClientsListRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    SharedModule
  ]
})
export class ClientsModule {}
