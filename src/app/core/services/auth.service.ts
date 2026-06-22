import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthResponse, StoredUser, TokenPayload } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';
import { NotificationService } from './notification.service';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorageService);
  private readonly notification = inject(NotificationService);

  private readonly _token = signal<string | null>(this.storage.get('auth_token'));

  readonly token = this._token.asReadonly();

  readonly isAuthenticated = computed(() => {
    const token = this._token();
    return token !== null && this.isTokenValid(token);
  });

  constructor() {
    // Detects an expired token on startup or whenever _token changes.
    // untracked prevents writing _token from scheduling another run of this effect.
    effect(() => {
      const token = this._token();
      if (token !== null && !this.isTokenValid(token)) {
        untracked(() => {
          this.storage.remove('auth_token');
          this._token.set(null);
          this.notification.show('Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        });
      }
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const users = this.storage.get('registered_users') ?? [];
    const user = users.find(u => u.email === email);

    if (!user) {
      return throwError(() => ({ status: 404, error: { code: 'USER_NOT_FOUND' } }));
    }

    if (user.passwordHash !== btoa(password)) {
      return throwError(() => ({ status: 401, error: { code: 'INVALID_PASSWORD' } }));
    }

    return of(this.saveToken(this.generateToken(email)));
  }

  register(email: string, password: string): Observable<AuthResponse> {
    const users = this.storage.get('registered_users') ?? [];

    if (users.some((u: StoredUser) => u.email === email)) {
      return throwError(() => ({ status: 409, error: { message: 'Email already registered' } }));
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash: btoa(password),
    };

    this.storage.set('registered_users', [...users, newUser]);

    return of(this.saveToken(this.generateToken(email)));
  }

  logout(): void {
    this.storage.remove('auth_token');
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token)) as TokenPayload;
      return typeof payload.exp === 'number' && payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  private generateToken(email: string): string {
    const now = Date.now();
    const payload: TokenPayload = { email, iat: now, exp: now + TOKEN_TTL_MS };
    return btoa(JSON.stringify(payload));
  }

  private saveToken(token: string): AuthResponse {
    this.storage.set('auth_token', token);
    this._token.set(token);
    return { token };
  }
}
