import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { AuthClientService } from '../services/auth.client.service';
import { UserService } from '../services/user.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthClientGuard implements CanActivate {
  constructor(private auth: AuthClientService, private router: Router, private userService: UserService) { }

  async canActivate(): Promise<boolean> {
    if (this.auth.isLoggedIn) { // Has firebase login
      const user = this.auth.currentUser();
      if (user) {
        const profile = await lastValueFrom(this.userService.getProflile(user.uid));
        
        // todo: if not profile - redirect to agree page??
        return !!profile
      }
    }

    this.router.navigate([`/login`]);
    return false;
  }
}