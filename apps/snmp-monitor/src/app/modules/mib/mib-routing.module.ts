import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MibListComponent } from './pages/mib-list/mib-list.component';

const routes: Routes = [
  {
    path: '',
    component: MibListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MibRoutingModule {}
