import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient) {

  }

  getAllPlayers() {
    return this.http.get<Player[]>('json/players_list.json');
  }
}
