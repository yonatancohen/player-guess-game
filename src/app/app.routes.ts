import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create-game', pathMatch: 'full' },
      {
        path: 'create-game',
        loadComponent: () => import('./components/create-game/create-game.component').then(m => m.CreateGameComponent)
      },
      {
        path: 'edit-player',
        loadComponent: () => import('./components/edit-player/edit-player.component').then(m => m.EditPlayerComponent)
      }
    ]
  }
];