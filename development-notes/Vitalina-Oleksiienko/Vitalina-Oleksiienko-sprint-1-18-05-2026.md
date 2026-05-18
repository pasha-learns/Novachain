# Sprint 1 Project Setup & Component Basics

- **_What was done_**:
  Added AuthService with login/register HTTP requests, JWT storage in localStorage, isAuthenticated computed signal, and logout.
  Added authGuard and guestGuard for route protection — /dashboard is inaccessible without a token, /login and /register redirect authenticated users to dashboard.
  Created LoginComponent — reactive form with email/password validation and backend error distinction (404 → user not found, 401 → wrong password).
  Created RegisterComponent — reactive form with email, password (min 8 characters), password confirmation, and a custom group validator for password match.
  Added HeaderComponent — SVG blockchain logo, navigation with routerLinkActive (gold underline on active item), Log In / Sign Up buttons that reactively update based on auth state.
  Header is automatically hidden on /login and /register pages via toSignal + NavigationEnd in app.ts.

- **_Problems_**:
  Had difficulty understanding how guestGuard should behave when the token exists in localStorage but the session has expired — the guard only checks token presence, not validity.

- **_Solutions_**:
  Kept guestGuard simple for now (token presence check); token expiry validation will be handled by an HTTP interceptor in a future sprint.

- **_What I learned_**:
  toSignal() from @angular/core/rxjs-interop cleanly converts an RxJS Observable into a Signal — useful for reacting to router events without manual subscriptions.
  Angular routerLinkActive adds a CSS class automatically when the route matches — no manual route comparison needed.
  Group-level validators in reactive forms receive the whole FormGroup as AbstractControl, allowing cross-field validation like password matching.

- **_Time spent_**: 8 hours.
