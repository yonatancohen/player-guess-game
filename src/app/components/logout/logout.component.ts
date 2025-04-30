import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html'
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
