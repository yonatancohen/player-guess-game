import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Player, UIPlayer } from '../../interfaces/player';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { GameNavComponent } from '../game-nav/game-nav.component';
import { lastValueFrom, map, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ResultPopupComponent } from '../result-popup/result-popup.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutocompleteComponent, GameNavComponent, ResultPopupComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  searchControl = new FormControl('');

  guessedPlayers: UIPlayer[] = [];
  guessedPlayersAnimatedWidths: { [id: number]: number } = {};
  guessedPlayersAnimatedColors: { [id: number]: string } = {};

  playersList: UIPlayer[] = [];

  showPopup: boolean = false;;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe({
      next: (players: Player[]) => {
        this.playersList = players.map(p => {
          return {
            ...p,
            color: this.getColor(0),
            width: 0,
            selected: false
          } as UIPlayer
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

  onSelected(player: UIPlayer) {
    player.selected = true;

    this.guessedPlayersAnimatedWidths[player.id] = 0;
    this.guessedPlayersAnimatedColors[player.id] = this.getColor(0);
    this.guessedPlayers.unshift(player);

    this.guessedPlayersAnimatedWidths[player.id] = player.width;
    this.guessedPlayersAnimatedColors[player.id] = this.getColor(0);

    const progressWidth = ((this.maxRank - (player.rank - 1)) / this.maxRank) * 100;
    setTimeout(() => {
      this.guessedPlayersAnimatedWidths[player.id] = progressWidth;
    }, 0);

    let count = 4;
    const intr = setInterval(() => {
      this.guessedPlayersAnimatedColors[player.id] = this.getColor(progressWidth / count); // Gradual color change

      count--;

      if (count <= 0) {
        clearInterval(intr);
      }
    }, 100);
  }

  trackByPlayer(index: number, p: Player) {
    return p.id;
  }

  onPreviousClicked() {

  }

  onNextClicked() {

  }
}