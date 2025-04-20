import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-nav',
  imports: [CommonModule],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.css'
})
export class GameNavComponent {
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPrev() {
    this.prev.emit();
  }

  onNext() {
    this.next.emit();
  }
}
