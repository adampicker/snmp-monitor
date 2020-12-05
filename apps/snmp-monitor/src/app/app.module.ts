import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routes } from './app-routing.module';
import { PageLayoutComponent } from './shared/layouts/page-layout/page-layout.component';
import { MenuTopComponent } from './shared/components/menu-top/menu-top.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { MenuLeftComponent } from './shared/components/menu-left/menu-left.component';
import { SharedModule } from './shared/shared.module';
import { SimpleModalModule } from 'ngx-simple-modal';
import { CoreModule } from './core/core.module';

import { NgxEchartsModule } from 'ngx-echarts';

import { ToastrModule } from 'ngx-toastr';
import * as echarts from 'echarts';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';

@NgModule({
  declarations: [AppComponent, PageLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    SimpleModalModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-center',
      timeOut: 15000
    }),
    NgxEchartsModule.forRoot({
      echarts
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
