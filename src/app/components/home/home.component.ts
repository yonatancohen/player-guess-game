import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructionsComponent } from '../instructions/instructions.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { GameService } from '../../services/game.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, InstructionsComponent, CountdownComponent],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  showInstructions = false;
  completlyHidden = true;

  next_player_ts: Date | undefined;

  constructor (private gameService: GameService) {

  }
  
  ngOnInit(): void {
    this.setCountr();
  }

  private async setCountr() {
    this.gameService.getNextGame().subscribe({
      next: (value: string) => {
        if (value) {
          this.next_player_ts = new Date(value);
        }
      }
    })
  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
    setTimeout(() => {
      this.completlyHidden = !this.showInstructions;
    }, 400);
  }
}