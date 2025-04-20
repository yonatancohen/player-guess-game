import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../interfaces/player';

@Component({
  selector: 'app-result-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-popup.component.html',
  styleUrl: './result-popup.component.css'
})
export class ResultPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  @Input() winner: Player | null = null;
  @Input() isVisible: boolean = false;

  close() {
    this.closePopup.emit();
  }
}