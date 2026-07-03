import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { AuthErrorMap, AuthErrorResponse, resolveAuthError } from '../../core/utils/auth-error.util';
import { injectAsyncSubmit } from '../../core/utils/async-submit';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';

const LOGIN_ERROR_MAP: AuthErrorMap = {
  codes: {
    USER_NOT_FOUND: 'No account found with this email',
    INVALID_PASSWORD: 'Incorrect password',
  },
  statuses: {
    404: 'No account found with this email',
    401: 'Incorrect password',
  },
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly asyncSubmit = injectAsyncSubmit<AuthResponse>();

  readonly isLoading = this.asyncSubmit.isLoading;
  readonly serverError = signal('');

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set('');

    const { email, password } = this.form.controls;

    this.asyncSubmit.submit(
      () => this.authService.login(email.value!, password.value!),
      {
        next: () => this.router.navigate(['/dashboard']),
        error: (err) =>
          this.serverError.set(
            resolveAuthError(err as AuthErrorResponse, LOGIN_ERROR_MAP, 'Login failed. Please try again')
          ),
      }
    );
  }
}
