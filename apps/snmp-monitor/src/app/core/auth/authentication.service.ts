import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private user$: Observable<User>;

  readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
    'Acces-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient, private router: Router) {
    const token = sessionStorage.getItem('token');
    console.log(token);

    this.currentUserSubject = new BehaviorSubject<User>({
      username: 'adam1',
      token: token
    });
    this.user$ = this.currentUserSubject.asObservable();
  }

  public getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: this.headers,
      observe: 'response'
    };
    return this.http
      .post<HttpResponse<any>>(
        `http://localhost:8080/login`,
        {
          username,
          password
        },
        { headers: this.headers, observe: 'response', responseType: 'json' }
      )
      .pipe(
        tap(res => {
          if (res.ok && res.headers.get('Authorization')) {
            this.currentUserSubject.next({
              username: username,
              token: res.headers.get('Authorization')
            });
            sessionStorage.setItem('token', res.headers.get('Authorization'));
          }
        })
      );
  }

  logout() {
    this.router.navigate(['login']);
    this.currentUserSubject.next(null);
  }

  public get isAuthenticated() {
    return (
      this.getCurrentUserValue().username && this.getCurrentUserValue().token
    );
  }

  signUp() {
    return this.http.post<any>('http://localhost:8080/users/sign-up', {
      username: 'adam1',
      password: 'adam'
    });
  }

  test() {
    return this.http.get<any>(
      `https://suprasl.logintrade.net/rejestracja/ustawowe.html`,
      { observe: 'response' }
    );
  }
}
