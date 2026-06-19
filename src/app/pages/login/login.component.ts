import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly serverError = signal('');

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private get email() {
    return this.form.get('email')!;
  }

  private get password() {
    return this.form.get('password')!;
  }

  private parseError(err: { status: number; error?: { code?: string; message?: string } }): string {
    const code = err.error?.code;
    if (code === 'USER_NOT_FOUND' || err.status === 404) return 'No account found with this email';
    if (code === 'INVALID_PASSWORD' || err.status === 401) return 'Incorrect password';
    return err.error?.message ?? 'Login failed. Please try again';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set('');

    this.authService.login(this.email.value!, this.password.value!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.isLoading.set(false);
        this.serverError.set(this.parseError(err));
      },
    });
  }
}
