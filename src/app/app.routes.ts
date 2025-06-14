import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { environment } from '../environments/environment';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthClientGuard } from './guards/auth.client.guard';

const authRedirect = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn ? 'games' : 'login';
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'game',
    canActivate: [AuthClientGuard],
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent)
  },
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
        loadComponent: () => import('./components/admin/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'games',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/admin/game-search/game-search.component').then(m => m.GameSearchComponent)
      },
      {
        path: 'game',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/admin/game-form/game-form.component').then(m => m.GameFormComponent)
      },
      {
        path: 'game/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/admin/game-form/game-form.component').then(m => m.GameFormComponent)
      },
      {
        path: 'edit-player',
        canActivate: [AuthGuard],
        loadComponent: () => import('./components/admin/edit-player/edit-player.component').then(m => m.EditPlayerComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' },
];