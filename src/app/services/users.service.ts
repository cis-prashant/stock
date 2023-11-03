import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './appConfig';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${AppConfig.API_URL}api/v1/users`);
  }

  saveUser(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/user`, data);
  }

  updateUser(data:any) {
    return this.http.put(`${AppConfig.API_URL}api/v1/user`, data);
  }
}
