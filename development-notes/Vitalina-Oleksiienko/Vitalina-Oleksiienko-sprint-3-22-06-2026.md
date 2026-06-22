# Sprint 3 Directives, Pipes, Tokens & OnPush

- **_What was done_**:
  Refactored `formControlName` bindings in `LoginComponent` and `RegisterComponent` templates to use `[formControl]="form.controls.fieldName"` — passing the `FormControl` instance directly instead of resolving it through the parent `FormGroup` directive.

  Created `ErrorMessagePipe` (`@Pipe`) — a pure pipe that accepts `ValidationErrors | null` and a `Record<string, string>` error messages map, and returns the first matching message or `null`. Integrated into `FormFieldComponent` template using the `@if (allErrors | errorMessage: errors(); as message)` pattern, replacing the `activeError` getter that previously handled this logic inside the component class.

  Created `ClickOutsideDirective` (`@Directive`) — listens to `document:click` via `@HostListener` and emits a `clickOutside` output when the click target is outside the host element. Applied to the `.search-bar` wrapper in `HeaderComponent` so the search panel closes when the user clicks anywhere outside it. The guard `isSearchOpen() && toggleSearch()` in the template prevents the directive from accidentally opening the search when it is already closed.

  Created `ENVIRONMENT` `InjectionToken` with `useValue: environment` registered in `app.config.ts`. Refactored `CryptoService` and `MarketsService` to inject the token via `inject(ENVIRONMENT)` instead of importing the `environment` object directly — making the services decoupled from the file path and easier to test.

  Added `ChangeDetectionStrategy.OnPush` to `FormFieldComponent`, `IconComponent`, and `LoginComponent`. All three are fully signal-based (`input()`, `signal()`, `computed()`), so Angular only re-checks them when a signal changes or an input reference changes — removing unnecessary checks on every global CD cycle.

- **_Problems_**:
  When applying `ClickOutsideDirective` to `.search-bar`, clicking the toggle button (which is inside the host) was a concern — it could potentially trigger `clickOutside` and fight with the button's own `(click)` handler. Also needed to make sure `clickOutside` does not fire when the search is already closed, which would incorrectly open it.

- **_Solutions_**:
  The `@HostListener('document:click', ['$event.target'])` approach naturally avoids the inner-click problem — `ElementRef.nativeElement.contains(target)` returns `true` for any child element, so clicks on the button or the search field do not emit. The accidental-open issue was solved with a simple template guard: `(clickOutside)="isSearchOpen() && toggleSearch()"`.

- **_What I learned_**:
  `InjectionToken` decouples services from concrete imports — instead of every service reaching into the file system for `environment`, a single `useValue` registration in `app.config.ts` becomes the one source of truth, and any consumer just calls `inject(ENVIRONMENT)`.
  `@HostListener('document:click')` attaches a listener to the document, not the host — this is how "click outside" detection works in Angular without using third-party libraries.
  Angular's `@if (expr; as variable)` syntax in the new control flow captures the expression result, which allows using a pipe's return value directly as a variable in the block without an extra getter in the class.
  `ChangeDetectionStrategy.OnPush` is safe for signal-based components because Angular's signal runtime automatically schedules re-checks when a signal value changes, even under `OnPush`.

- **_Time spent_**: 10 hours.
