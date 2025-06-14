import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthClientService } from '../../../services/auth.client.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html'
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private authClientService: AuthClientService,
    private router: Router
  ) { }

  isLoggedIn = computed(() => {
    return this.authService.isLoggedIn || this.authClientService.isLoggedIn;
  });


  logout() {
    if (this.authService.isLoggedIn) {
      this.authService.logout();
      this.router.navigate(['/admin/login']);
    }

    if (this.authClientService.isLoggedIn) {
      this.authClientService.logout();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }
}
