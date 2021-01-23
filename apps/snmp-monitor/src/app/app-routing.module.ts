import { RouterModule, Routes } from '@angular/router';
import { PageLayoutComponent } from './shared/layouts/page-layout/page-layout.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'clients'
  },
  {
    path: 'dashboard',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'clients',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/clients/clients.module').then(m => m.ClientsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mibs',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/mib/mib.module').then(m => m.MibModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/configuration/configuration.module').then(
        m => m.ConfigurationModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: PageLayoutComponent,
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
