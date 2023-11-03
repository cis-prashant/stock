import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from './appConfig';
import { User } from '../models';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const currentUserData = localStorage.getItem('currentUser');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(data: Object): Observable<any> {
    return this.http.post<any>(`${AppConfig.API_URL}api/v1/login`, data)
      .pipe(map(data => {
        if (data.success === true) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data.data));
          this.currentUserSubject.next(data.data);
          return data;
        } else {
          localStorage.removeItem('currentUser');

        }
        return data;
      }));
  }

  deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.deleteAllCookies()
    this.currentUserSubject.next(null);
    var isSocialLogin = localStorage.getItem("isSocialLogin");
    //this.router.navigate(['/login']);
  }

  checkActiveLogin() {
    return this.http.post(`${AppConfig.API_URL}api/v1/auth/validate`, {});
  }
}
