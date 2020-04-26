import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { ClientsListRoutingModule } from './clients-list-routing.module';
import { ClientsListHeaderComponent } from './components/clients-list-header/clients-list-header.component';

@NgModule({
  declarations: [ClientsListComponent, ClientsListHeaderComponent],
  imports: [CommonModule, ClientsListRoutingModule]
})
export class ClientsModule {}
