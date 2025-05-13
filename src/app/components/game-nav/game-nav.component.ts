import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/models';

@Component({
  selector: 'app-game-nav',
  imports: [CommonModule],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.css'
})
export class GameNavComponent {
  @Input() gameInfo!: Game;

  @Output() pageChanged = new EventEmitter<number>();

  onPrev() {
    this.pageChanged.emit(this.gameInfo.game_number - 1);
  }

  onFirst() {
    this.pageChanged.emit(1);
  }

  onNext() {
    if (this.gameInfo.game_number + 1 == this.gameInfo.max_game_number) {
      this.pageChanged.emit(undefined);
    }
    else {
      this.pageChanged.emit(this.gameInfo.game_number + 1);
    }
  }

  onLast() {
    this.pageChanged.emit(undefined);
  }
}
