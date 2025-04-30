import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Game {
  id: number;
  player_name: string;
  activate_at: string;
  hint: string;
}

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class GameSearchComponent implements OnInit {
  searchForm = {
    date: '',
    playerName: ''
  };
  games: Game[] = [];
  searching: boolean = false;

  environment = environment;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  searchGames() {
    if (!this.searchForm.date && this.searchForm.playerName?.length < 2) return;
    this.searching = true;
    this.adminService.searchGame({
      game_date: this.searchForm.date,
      player_name: this.searchForm.playerName
    }).subscribe({
      next: (games) => {
        this.games = games;
        this.searching = false;
      },
      error: () => {
        this.searching = false;
      }
    });
  }

  editGame(gameId: number) {
    this.router.navigate([`/${environment.adminPath}game`, gameId]);
  }

  createNewGame() {
    this.router.navigate([`/${environment.adminPath}game`]);
  }
} 