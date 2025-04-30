import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdminGame, AdminGameResponse, Country, FullPlayer, League, Player } from '../interfaces/models';
import { getHeaders } from './headers';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getLeagues() {
    return this.http.get<Array<League>>(`${environment.apiUrl}api/admin/leagues`, {
      headers: getHeaders()
    });
  }

  getCountries() {
    return this.http.get<Array<Country>>(`${environment.apiUrl}api/admin/countries`, {
      headers: getHeaders()
    });
  }

  createGame(player_id: number, activate_at: string, leagues: Array<number>, hint: string) {
    return this.http.post(`${environment.apiUrl}api/admin/games`, { player_id, leagues, activate_at, hint });
  }

  updateGame(game_id: number, player_id: number, activate_at: string, leagues: Array<number>, hint: string) {
    return this.http.put(`${environment.apiUrl}api/admin/games/${game_id}`, { player_id, leagues, activate_at, hint });
  }

  searchPlayers(query: string) {
    return this.http.get<Array<Player>>(`${environment.apiUrl}api/admin/players`, {
      headers: getHeaders(),
      params: { query }
    });
  }

  getPlayer(player_id: number) {
    return this.http.get<FullPlayer>(`${environment.apiUrl}api/admin/players/${player_id}`, {
      headers: getHeaders()
    });
  }

  updatePlayer(id: number, formData: any) {
    return this.http.post(`${environment.apiUrl}api/admin/players/${id}`, {
      first_name_he: formData.first_name_he,
      last_name_he: formData.last_name_he,
      display_name_he: formData.display_name_he,
      nationality_id: formData.nationality_id
    }, {
      headers: getHeaders()
    });
  }

  searchGame(params: { game_date?: string; player_name?: string }) {
    return this.http.get<Array<{
      id: number;
      player_name: string;
      activate_at: string;
      leagues: Array<League>,
      hint: string;
    }>>(`${environment.apiUrl}api/admin/games/search`, {
      headers: getHeaders(),
      params: new HttpParams({ fromObject: params })
    });
  }

  getGame(gameId: number) {
    return this.http.get<AdminGameResponse>(`${environment.apiUrl}api/admin/games/${gameId}`, {
      headers: getHeaders()
    });
  }
}
