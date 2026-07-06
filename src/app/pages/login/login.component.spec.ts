import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { AuthResponse } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.whenStable();
  });

  function fillForm(email: string, password: string): void {
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid, untouched form and no error state', () => {
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.email.touched).toBe(false);
    expect(component.form.controls.password.touched).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.serverError()).toBe('');
  });

  describe('validation', () => {
    it('marks email as required', () => {
      const email = component.form.controls.email;
      email.setValue('');
      expect(email.hasError('required')).toBe(true);
    });

    it('marks email as invalid when not a valid email format', () => {
      const email = component.form.controls.email;
      email.setValue('not-an-email');
      expect(email.hasError('email')).toBe(true);
    });

    it('accepts a well-formed email', () => {
      const email = component.form.controls.email;
      email.setValue('user@example.com');
      expect(email.valid).toBe(true);
    });

    it('marks password as required', () => {
      const password = component.form.controls.password;
      password.setValue('');
      expect(password.hasError('required')).toBe(true);
    });
  });

  describe('onSubmit with an invalid form', () => {
    it('does not call AuthService.login', () => {
      fillForm('', '');

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('marks all controls as touched so validation errors surface', () => {
      fillForm('', '');

      component.onSubmit();

      expect(component.form.controls.email.touched).toBe(true);
      expect(component.form.controls.password.touched).toBe(true);
    });

    it('does not set isLoading', () => {
      fillForm('not-an-email', '');

      component.onSubmit();

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onSubmit with a valid form', () => {
    it('calls AuthService.login with the form values', () => {
      const login$ = new Subject<AuthResponse>();
      authService.login.mockReturnValue(login$);
      fillForm('user@example.com', 'secret123');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'secret123');
    });

    it('sets isLoading while the request is pending and clears it on completion', () => {
      const login$ = new Subject<AuthResponse>();
      authService.login.mockReturnValue(login$);
      fillForm('user@example.com', 'secret123');

      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      login$.next({ token: 'jwt-token' });
      login$.complete();
      expect(component.isLoading()).toBe(false);
    });

    it('clears a previous server error when resubmitting', () => {
      component.serverError.set('Incorrect password');
      const login$ = new Subject<AuthResponse>();
      authService.login.mockReturnValue(login$);
      fillForm('user@example.com', 'secret123');

      component.onSubmit();

      expect(component.serverError()).toBe('');
    });

    it('navigates to /dashboard on success', () => {
      const login$ = new Subject<AuthResponse>();
      authService.login.mockReturnValue(login$);
      fillForm('user@example.com', 'secret123');

      component.onSubmit();
      login$.next({ token: 'jwt-token' });
      login$.complete();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('clears isLoading even when the request errors', () => {
      authService.login.mockReturnValue(throwError(() => ({ status: 500 })));
      fillForm('user@example.com', 'secret123');

      component.onSubmit();

      expect(component.isLoading()).toBe(false);
    });

    it('does not navigate when the request errors', () => {
      authService.login.mockReturnValue(throwError(() => ({ status: 500 })));
      fillForm('user@example.com', 'secret123');

      component.onSubmit();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('server error messages', () => {
    const cases: Array<[string, { status: number; error?: { code?: string; message?: string } }, string]> = [
      ['USER_NOT_FOUND code', { status: 400, error: { code: 'USER_NOT_FOUND' } }, 'No account found with this email'],
      ['plain 404 status', { status: 404 }, 'No account found with this email'],
      ['INVALID_PASSWORD code', { status: 400, error: { code: 'INVALID_PASSWORD' } }, 'Incorrect password'],
      ['plain 401 status', { status: 401 }, 'Incorrect password'],
      [
        'a custom server message',
        { status: 409, error: { message: 'Email already registered' } },
        'Email already registered',
      ],
      ['an unrecognized error with no message', { status: 500 }, 'Login failed. Please try again'],
    ];

    it.each(cases)('maps %s to the correct message', (_label, err, expected) => {
      authService.login.mockReturnValue(throwError(() => err));
      fillForm('user@example.com', 'secret123');

      component.onSubmit();

      expect(component.serverError()).toBe(expected);
    });
  });

  describe('template', () => {
    it('shows the server error message in the DOM when set', async () => {
      fixture.detectChanges();
      component.serverError.set('Incorrect password');

      await fixture.whenStable();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.server-error'));
      expect(errorEl?.nativeElement.textContent).toContain('Incorrect password');
    });

    it('does not render the server error element when there is no error', () => {
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.server-error'));
      expect(errorEl).toBeNull();
    });

    it('disables the submit button while loading', async () => {
      const login$ = new Subject<AuthResponse>();
      authService.login.mockReturnValue(login$);
      fixture.detectChanges();
      fillForm('user@example.com', 'secret123');

      component.onSubmit();
      await fixture.whenStable();
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.submit-btn')).nativeElement as HTMLButtonElement;
      expect(button.disabled).toBe(true);

      login$.next({ token: 'jwt-token' });
      login$.complete();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(button.disabled).toBe(false);
    });
  });
});
