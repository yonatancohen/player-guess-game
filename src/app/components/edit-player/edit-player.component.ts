import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditPlayerComponent {
  player = {
    firstName: '',
    lastName: '',
    displayName: '',
    playerNumber: null,
    country: ''
  };

  countries = [
    'Argentina', 'Brazil', 'England', 'France', 'Germany', 'Italy', 'Netherlands',
    'Portugal', 'Spain', 'United States'
  ];

  onSubmit() {
    console.log('Player data:', this.player);
    // Here you would typically make an API call to save the player data
  }
} 