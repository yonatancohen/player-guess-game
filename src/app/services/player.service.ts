import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient) {

  }
  

  getPlayers() {
    return this.http.get<Player[]>('json/players.json');
  }
}
