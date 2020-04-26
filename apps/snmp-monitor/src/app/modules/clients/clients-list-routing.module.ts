import { Routes, RouterModule } from '@angular/router';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsListRoutingModule {}
