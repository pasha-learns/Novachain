import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthResponse, StoredUser } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorageService);

  private readonly _token = signal<string | null>(this.storage.get('auth_token'));

  /** Readonly signal with the raw JWT. Use when you need the token value itself (e.g. HTTP interceptor). */
  readonly token = this._token.asReadonly();

  /** Derived boolean — use for route guards and UI visibility checks. */
  readonly isAuthenticated = computed(() => !!this._token());

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

    if (users.some(u => u.email === email)) {
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

  private generateToken(email: string): string {
    return btoa(JSON.stringify({ email, iat: Date.now() }));
  }

  private saveToken(token: string): AuthResponse {
    this.storage.set('auth_token', token);
    this._token.set(token);
    return { token };
  }
}
