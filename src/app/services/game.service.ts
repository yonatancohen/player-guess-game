import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Game } from '../interfaces/models';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AuthClientService } from './auth.client.service';
import { getClienteaders } from './headers';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private currentGameSubject = new ReplaySubject<Game>(1);

  constructor(
    private http: HttpClient,
    private authClientService: AuthClientService,
    private firestoreService: FirestoreService
  ) { }

  checkGameAnswer(game_number: number, player_id: number) {
    return this.http.post<number>(`${environment.apiUrl}api/check-rank`, { game_number, player_id });
  }

  private async setDocTimestamp(game_number: number) {
    const user = this.authClientService.currentUser();
    if (user) {
      await this.firestoreService.setDocTimestamp(game_number, user.uid);
    }
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

  completeGame(uid: string, game_number: number, guessed_players: string) {
    return this.http.post<number>(`${environment.apiUrl}api/complete-game`, { 
      game_number, guessed_players 
    }, {
      headers: getClienteaders(uid)
    });
  }
}
