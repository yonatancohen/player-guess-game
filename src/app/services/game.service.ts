import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Game } from '../interfaces/models';
import { BehaviorSubject, ReplaySubject, firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private currentGameSubject = new ReplaySubject<Game>(1);

  constructor(private http: HttpClient) { }

  checkGameAnswer(game_number: number, player_id: number) {
    return this.http.post<number>(`${environment.apiUrl}api/check-rank`, {game_number, player_id});
  }

  getGame(game_number?: number) {
    let url = `${environment.apiUrl}api/game`;
    if (game_number) {
      url += `?game_number=${game_number}`
    }
    
    return this.http.get<Game>(url);
  }

  async getCurrentGame(): Promise<Game> {
    const currentGame = await firstValueFrom(this.currentGameSubject);
    return currentGame;
  }

  getNextGame() {
    return this.http.get(`${environment.apiUrl}api/next-game`, { responseType: 'text' });
  }
}
