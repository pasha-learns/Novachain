import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { AuthErrorResponse, resolveAuthError } from '../../core/utils/auth-error.util';
import { injectAsyncSubmit } from '../../core/utils/async-submit';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly asyncSubmit = injectAsyncSubmit<AuthResponse>();

  readonly isLoading = this.asyncSubmit.isLoading;
  readonly serverError = signal('');

  readonly form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set('');

    const { email, password } = this.form.controls;

    this.asyncSubmit.submit(
      () => this.authService.register(email.value!, password.value!),
      {
        next: () => this.router.navigate(['/dashboard']),
        error: (err) =>
          this.serverError.set(
            resolveAuthError(err as AuthErrorResponse, {}, 'An error occurred during registration')
          ),
      }
    );
  }
}
