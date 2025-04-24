import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  login(username: string, password: string): boolean {
    if (username === 'sport5' && password === 'guessgame5') {
      localStorage.setItem('auth_token', 'dummy_token');
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated.value;
  }
} 