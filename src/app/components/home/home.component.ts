import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructionsComponent } from '../instructions/instructions.component';
import { CountdownComponent } from '../countdown/countdown.component';

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

  next_player_ts = new Date();
  
  ngOnInit(): void {
    this.next_player_ts.setMinutes(this.next_player_ts.getMinutes() + Math.floor(Math.random() * 120) + 1);
  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
    setTimeout(() => {
      this.completlyHidden = !this.showInstructions;
    }, 400);
  }
}