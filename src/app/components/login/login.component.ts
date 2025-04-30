import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
  }

  onSubmit() {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        this.router.navigate([`/${environment.adminPath}`]);
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    })
  }
} 