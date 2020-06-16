import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { UserStore } from './store/user.state';
import { ModalStore } from './store/modal.state';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth/authentication.service';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { DataStore } from './store/data.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([UserStore, ModalStore, DataStore])
  ],
  providers: [
    AuthenticationService,
    JwtInterceptor,
    ErrorInterceptor,
    AuthGuard
  ]
})
export class CoreModule {}
