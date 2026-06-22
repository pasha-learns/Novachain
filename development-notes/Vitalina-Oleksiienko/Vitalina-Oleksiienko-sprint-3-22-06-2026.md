# Sprint 3 Directives, Pipes, Tokens & OnPush

- **_What was done_**:
  Refactored `formControlName` bindings in `LoginComponent` and `RegisterComponent` templates to use `[formControl]="form.controls.fieldName"` — passing the `FormControl` instance directly instead of resolving it through the parent `FormGroup` directive.

  Created `ErrorMessagePipe` (`@Pipe`) — a pure pipe that accepts `ValidationErrors | null` and a `Record<string, string>` error messages map, and returns the first matching message or `null`. Integrated into `FormFieldComponent` template using the `@if (allErrors | errorMessage: errors(); as message)` pattern, replacing the `activeError` getter that previously handled this logic inside the component class.

  Created `ClickOutsideDirective` (`@Directive`) — listens to `document:click` via `@HostListener` and emits a `clickOutside` output when the click target is outside the host element. Applied to the `.search-bar` wrapper in `HeaderComponent` so the search panel closes when the user clicks anywhere outside it. The guard `isSearchOpen() && toggleSearch()` in the template prevents the directive from accidentally opening the search when it is already closed.

  Created `ENVIRONMENT` `InjectionToken` with `useValue: environment` registered in `app.config.ts`. Refactored `CryptoService` and `MarketsService` to inject the token via `inject(ENVIRONMENT)` instead of importing the `environment` object directly — making the services decoupled from the file path and easier to test.

  Added `ChangeDetectionStrategy.OnPush` to `FormFieldComponent`, `IconComponent`, and `LoginComponent`. All three are fully signal-based (`input()`, `signal()`, `computed()`), so Angular only re-checks them when a signal changes or an input reference changes — removing unnecessary checks on every global CD cycle.

  Added token expiry validation to `AuthService`. Extended the token payload with an `exp` field (24-hour TTL) defined in the new `TokenPayload` interface in `auth.model.ts`. Added a private `isTokenValid(token)` method that decodes the base64 token, parses the JSON payload, and checks `payload.exp > Date.now()` — returning `false` for malformed or missing `exp`. Updated the `isAuthenticated` computed signal to call `isTokenValid`, so guards automatically treat expired tokens as unauthenticated without any changes to the guard code itself.

  Added an `effect` in the `AuthService` constructor that watches the `_token` signal. When it detects a non-null but invalid token, it runs cleanup inside `untracked()`: removes the token from localStorage, sets `_token` to `null`, shows a user-facing notification, and navigates to `/login`. `untracked()` is used so the write to `_token` inside the effect does not schedule another execution of the same effect.

  Created `NotificationService` — a lightweight signal-based service with a `show(text, duration?)` method. It sets a `_message` signal and automatically clears it after 4 seconds using `setTimeout`. The public `message` readonly signal is consumed by `ToastComponent`.

  Created `ToastComponent` — a standalone `OnPush` component mounted once in `app.html`. Renders a fixed-position red toast banner whenever `notification.message()` is non-null. Includes `role="alert"` and `aria-live="assertive"` for screen reader support.

- **_Problems_**:
  When applying `ClickOutsideDirective` to `.search-bar`, clicking the toggle button (which is inside the host) was a concern — it could potentially trigger `clickOutside` and fight with the button's own `(click)` handler. Also needed to make sure `clickOutside` does not fire when the search is already closed, which would incorrectly open it.

  When writing to the `_token` signal inside the expiry `effect`, Angular would normally schedule another run of the same effect, potentially causing a loop or a "signal write inside effect" error.

- **_Solutions_**:
  The `@HostListener('document:click', ['$event.target'])` approach naturally avoids the inner-click problem — `ElementRef.nativeElement.contains(target)` returns `true` for any child element, so clicks on the button or the search field do not emit. The accidental-open issue was solved with a simple template guard: `(clickOutside)="isSearchOpen() && toggleSearch()"`.

  Wrapping the cleanup logic in `untracked()` tells Angular not to track any signal reads or writes that happen inside it, so setting `_token` to `null` does not re-trigger the effect.

- **_What I learned_**:
  `InjectionToken` decouples services from concrete imports — instead of every service reaching into the file system for `environment`, a single `useValue` registration in `app.config.ts` becomes the one source of truth, and any consumer just calls `inject(ENVIRONMENT)`.
  `@HostListener('document:click')` attaches a listener to the document, not the host — this is how "click outside" detection works in Angular without using third-party libraries.
  Angular's `@if (expr; as variable)` syntax in the new control flow captures the expression result, which allows using a pipe's return value directly as a variable in the block without an extra getter in the class.
  `ChangeDetectionStrategy.OnPush` is safe for signal-based components because Angular's signal runtime automatically schedules re-checks when a signal value changes, even under `OnPush`.
  `effect()` in Angular is meant for side effects that react to signal changes, but writing to a signal inside an effect requires `untracked()` to break the reactive tracking chain and avoid unintended re-execution.
  Storing `exp` inside the token payload (instead of a separate localStorage entry) keeps the session validity self-contained — no extra storage keys to sync or clean up.

- **_Time spent_**: 13 hours.
