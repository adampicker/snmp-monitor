import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConfigurationListComponent } from './pages/configuration-list/configuration-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
