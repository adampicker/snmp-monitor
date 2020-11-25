import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ɵConsole
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'apps/snmp-monitor/src/app/core/auth/authentication.service';

import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'snmp-monitor-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  username: string;
  password: string;

  isLoading = false;
  submitted = false;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signInForm = new FormGroup({
      username: new FormControl(this.username, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(18)
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(18)
      ])
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    this.username = this.signInForm.controls['username'].value;
    this.password = this.signInForm.controls['password'].value;
    this.authenticationService
      .signUp(this.username, this.password)
      .subscribe(response => {
        console.log(response);
        this.authenticationService
          .login(this.username, this.password)
          .subscribe(
            (res: HttpResponse<any>) => {
              console.log(res);
              if (res.status === 200 && res.headers.get('Authorization')) {
                this.router.navigate(['/dashboard']);
              } else {
              }
            },
            err => {
              (this.signInForm.controls.password as FormControl).setValue('');
              this.signInForm.markAsUntouched();
              this.isLoading = false;
              this.submitted = false;
            }
          );
      });
  }
}
