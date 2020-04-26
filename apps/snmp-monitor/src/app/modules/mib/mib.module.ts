import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MibRoutingModule } from './mib-routing.module';
import { MibListComponent } from './pages/mib-list/mib-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MibHeaderComponent } from './components/mib-header/mib-header.component';

@NgModule({
  declarations: [MibListComponent, MibHeaderComponent],
  imports: [
    CommonModule,
    MibRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class MibModule {}
