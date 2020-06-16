import { Routes, RouterModule } from '@angular/router';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { NgModule } from '@angular/core';
import { ClientDetailsComponent } from './pages/client-details/client-details.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent
  },
  {
    path: 'details/:id',
    component: ClientDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsListRoutingModule {}
