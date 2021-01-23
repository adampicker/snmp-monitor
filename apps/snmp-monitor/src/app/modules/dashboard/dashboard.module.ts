import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AboutComponent } from './pages/about/about.component';
import { GuideComponent } from './pages/guide/guide.component';

@NgModule({
  declarations: [DashboardComponent, AboutComponent, GuideComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule {}
