import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

interface Game {
  id: number;
  player_name: string;
  activate_at: string;
  hint: string;
  game_number: number;
}

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminMenuComponent]
})
export class GameSearchComponent implements OnInit {
  searchForm = {
    date: '',
    playerName: '',
    gameNumber: ''
  };
  games: Game[] = [];
  searching: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchGames();
  }

  clearFilters() {
    this.searchForm.date = '';
    this.searchForm.playerName = '';
    this.searchForm.gameNumber = '';
  }

  searchGames() {
    this.searching = true;
    this.adminService.searchGame({
      game_date: this.searchForm.date?.trim() || '',
      player_name: this.searchForm.playerName?.trim() || '',
      game_number: this.searchForm.gameNumber?.toString().trim() || ''
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