import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private isLoggedInSignal = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<void> {
    return this.http.post<TokenResponse>(`${environment.apiUrl}api/admin/token`, new URLSearchParams({ username, password, }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(resp => {
        localStorage.setItem(this.TOKEN_KEY, resp.access_token);
        this.isLoggedInSignal.set(true);
      }),
      map(() => { })
    );
  }

  get isLoggedIn() {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedInSignal.set(false);
  }
}
