import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { AuthGuard } from './guards/auth.guard';
import { environment } from '../environments/environment';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const authRedirect = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn ? 'games' : 'login';
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  {
    path: environment.adminPath.replace('/', ''),
    children: [
      { 
        path: '', 
        redirectTo: authRedirect, 
        pathMatch: 'full' 
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'games',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/game-search/game-search.component').then(m => m.GameSearchComponent)
      },
      {
        path: 'game',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/game-form/game-form.component').then(m => m.GameFormComponent)
      },
      {
        path: 'game/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/game-form/game-form.component').then(m => m.GameFormComponent)
      },
      {
        path: 'edit-player',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/edit-player/edit-player.component').then(m => m.EditPlayerComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' },
];