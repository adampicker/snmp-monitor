import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { MenuTopComponent } from './components/menu-top/menu-top.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [SpinnerComponent, MenuLeftComponent, MenuTopComponent],
  imports: [CommonModule, SharedRoutingModule],
  exports: [SpinnerComponent, MenuTopComponent, MenuLeftComponent]
})
export class SharedModule {}
