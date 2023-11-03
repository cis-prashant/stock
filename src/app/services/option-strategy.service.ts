import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './appConfig';

@Injectable({
  providedIn: 'root'
})
export class OptionStrategyService {

  constructor(private http: HttpClient) { }

  list(params: any) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return this.http.get(`${AppConfig.API_URL}api/v1/optionStrategy/list?${queryString}`);
  }

  getOptionStrategy(id : number) {
    return this.http.get(`${AppConfig.API_URL}api/v1/optionStrategy/get/${id}`);
  }

  analyserStrategy(id : number, data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/optionStrategy/get/${id}`, data);
  }

  analyserCalc(data:any) {
    return this.http.post(`${AppConfig.API_URL}api/v1/optionStrategy/calc`, data);
  }
}
