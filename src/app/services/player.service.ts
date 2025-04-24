import { Injectable } from '@angular/core';
import { Player } from '../interfaces/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getHeaders } from './headers';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient) {

  }

  getPlayersByLeagues(leagueIds: number[]): Observable<Player[]> {
    const params = new HttpParams().set('leagues_id', leagueIds.join(','));
    return this.http.get<Array<Player>>(`${environment.apiUrl}api/admin/players`, {
      params,
      headers: getHeaders() // אם אתה צריך headers מותאמים
    }
    );
  }
}
