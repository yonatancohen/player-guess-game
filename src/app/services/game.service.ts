import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Game } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  checkGameAnswer(game_id: number, player_id: number) {
    return this.http.post<number>(`${environment.apiUrl}api/check-rank/`, {game_id, player_id});
  }

  createGame(player_id: number) {
    return this.http.post(`${environment.apiUrl}api/game/`, { player_id });
  }

  getGame(game_id?: number) {
    let url = `${environment.apiUrl}api/game/`;
    if (game_id) {
      url += `?game_id=${game_id}`
    }
    
    return this.http.get<Game>(url);
  }
}
