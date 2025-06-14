import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { AuthClientService } from '../services/auth.client.service';

@Injectable({ providedIn: 'root' })
export class AuthClientGuard implements CanActivate {
  constructor(private auth: AuthClientService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (this.auth.isLoggedIn) {
      return true;
    }

    this.router.navigate([`/login`]);
    return false;
  }
}