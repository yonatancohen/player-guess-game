import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GamePlayer } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getGame() {
    return this.http.get<GamePlayer[]>('json/game_players.json');
  }
}
