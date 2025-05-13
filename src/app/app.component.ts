import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LogoutComponent } from './components/logout/logout.component';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogoutComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdminRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAdminRoute = window.location.pathname.includes(environment.adminPath);
    });
  }
}
