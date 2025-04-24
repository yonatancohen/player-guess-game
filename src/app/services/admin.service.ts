import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { League } from '../interfaces/models';
import { getHeaders } from './headers';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get(`${environment.apiUrl}api/admin/countries`, {
      headers: getHeaders()
    });
  }

  getLeagues() {
    return this.http.get<Array<League>>(`${environment.apiUrl}api/admin/leagues`, {
      headers: getHeaders()
    });
  }
}
