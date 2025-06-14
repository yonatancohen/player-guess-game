import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Game, GamePlayer, Player, UIGamePlayer } from '../../interfaces/models';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { GameNavComponent } from '../game-nav/game-nav.component';
import { ResultPopupComponent } from '../result-popup/result-popup.component';
import { GameService } from '../../services/game.service';
import { DecodeuUriPipe } from '../../pipes/decodeu-uri.pipe';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthClientService } from '../../services/auth.client.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutocompleteComponent, GameNavComponent, ResultPopupComponent, DecodeuUriPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  searchControl = new FormControl('');

  guessedPlayers: UIGamePlayer[] = [];
  guessedPlayersIds: number[] = [];
  guessedPlayersAnimatedWidths: { [id: number]: number } = {};
  guessedPlayersAnimatedColors: { [id: number]: string } = {};

  gameCompleted: boolean = false;
  showHint: boolean = false;

  showPopup: boolean = false;

  private pageSubject = new BehaviorSubject<number | undefined>(undefined);
  private currentGameSubject = new ReplaySubject<Game>(1);

  isLoggedIn = computed(() => !!this.auth.isLoggedIn);

  game$ = this.pageSubject.pipe(
    switchMap((page) => this.gameService.getGame(page)),
    tap((game) => {
      this.currentGameSubject.next(game);
      this.guessedPlayers = [];
      this.guessedPlayersIds = [];
      this.guessedPlayersAnimatedWidths = {};
      this.guessedPlayersAnimatedColors = {};
      this.gameCompleted = false;
    })
  );

  constructor(
    public auth: AuthClientService,
    private gameService: GameService,
    private firestoreService: FirestoreService) { }

  ngOnInit(): void {

  }

  private getColor(value: number): string {
    if (value < 30) return '#EF4444';      // red-500
    if (value < 60) return '#F97316';      // orange-500
    if (value < 80) return '#FACC15';      // yellow-400
    return '#22C55E';                      // green-500
  }

  async onSelected(player: Player) {
    if (this.guessedPlayersIds.includes(player.id)) return;

    const currentGame = await firstValueFrom(this.currentGameSubject);
    const rank: number = await lastValueFrom(this.gameService.checkGameAnswer(currentGame.game_number, player.id))
    if (!rank) return;

    const foundGamePlayer = {
      ...player, ...{
        rank: rank,
        color: this.getColor(0),
        width: 0,
        selected: true
      }
    } as UIGamePlayer;

    if (currentGame && this.auth.currentUser()) {
      if (currentGame.game_number == currentGame.max_game_number) {
        this.firestoreService.setDocTimestamp(currentGame.game_number, this.auth.currentUser()!.uid);
      }
    }

    this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = 0;
    this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(0);
    this.guessedPlayers.unshift(foundGamePlayer);

    this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = foundGamePlayer.width;
    this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(0);

    let progressWidth = ((currentGame.max_rank - (foundGamePlayer.rank - 1)) / currentGame.max_rank) * 100;
    if (progressWidth !== 100 && progressWidth > 98.5) {
      progressWidth = 98.5;
    }
    setTimeout(() => {
      this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = progressWidth;
    }, 200);

    let count = 4;
    const intr = setInterval(() => {
      this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(progressWidth / count); // Gradual color change

      count--;

      if (count <= 0) {
        clearInterval(intr);
      }
    }, 100);

    if (foundGamePlayer.rank == 1) {
      if (currentGame && this.auth.currentUser()) {
        const players = this.guessedPlayers.reverse().map((player, index) => {
          return {
            id: player.id,
            name: player.name,
            rank: player.rank,
            guess_order: index + 1
          }
        });

        this.gameService.completeGame(this.auth.currentUser()!.uid, currentGame.game_number, JSON.stringify(players)).subscribe({
          next: (response) => {
            this.gameCompleted = true;
            alert('done!')
          },
          error: (error) => {
            debugger;
          }
        });
      }
    }
  }

  trackByPlayer(index: number, p: UIGamePlayer) {
    return p.id;
  }

  onPageChanged(pageNumber: number) {
    this.pageSubject.next(pageNumber);
  }
}