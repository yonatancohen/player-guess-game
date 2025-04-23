import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GamePlayer, Player, UIGamePlayer } from '../../interfaces/player';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { GameNavComponent } from '../game-nav/game-nav.component';
import { ResultPopupComponent } from '../result-popup/result-popup.component';
import { GameService } from '../../services/game.service';
import { DecodeuUriPipe } from '../../pipes/decodeu-uri.pipe';

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

  playersList: UIGamePlayer[] = [];

  showPopup: boolean = false;;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGame().subscribe({
      next: (players: GamePlayer[]) => {
        this.playersList = players.map(p => {
          return {
            ...p,
            color: this.getColor(0),
            width: 0,
            selected: false
          } as UIGamePlayer
        })
      }
    })
  }

  private getColor(value: number): string {
    if (value < 30) return '#EF4444';      // red-500
    if (value < 60) return '#F97316';      // orange-500
    if (value < 80) return '#FACC15';      // yellow-400
    return '#22C55E';                      // green-500
  }

  get maxRank() {
    return Math.max(...this.playersList.map(p => p.rank));
  }

  onSelected(player: Player) {
    if (this.guessedPlayersIds.includes(player.id)) return;

    let foundGamePlayer = this.playersList.find(p => p.id == player.id);
    if (!foundGamePlayer) return;

    foundGamePlayer = {...player, ...foundGamePlayer} as UIGamePlayer;

    foundGamePlayer.selected = true;

    this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = 0;
    this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(0);
    this.guessedPlayers.unshift(foundGamePlayer);

    this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = foundGamePlayer.width;
    this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(0);

    const progressWidth = ((this.maxRank - (foundGamePlayer.rank - 1)) / this.maxRank) * 100;
    setTimeout(() => {
      this.guessedPlayersAnimatedWidths[foundGamePlayer.id] = progressWidth;
    }, 0);

    let count = 4;
    const intr = setInterval(() => {
      this.guessedPlayersAnimatedColors[foundGamePlayer.id] = this.getColor(progressWidth / count); // Gradual color change

      count--;

      if (count <= 0) {
        clearInterval(intr);
      }
    }, 100);
  }

  trackByPlayer(index: number, p: UIGamePlayer) {
    return p.id;
  }

  onPreviousClicked() {

  }

  onNextClicked() {

  }
}