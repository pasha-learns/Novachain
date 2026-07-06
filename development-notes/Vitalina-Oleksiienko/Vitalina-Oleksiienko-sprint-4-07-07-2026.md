# Sprint 4 HTTP, RxJS & Testing

- **_What was done_**:
  Added:
  - HttpInterceptor for for auth token
  - Tests for login component
  - async-submit.ts — injectAsyncSubmit<T>(): routes submits through exhaustMap (ignores a second submit while one is pending — no more relying solely on [disabled] timing), manages isLoading via finalize, and uses catchError → EMPTY so an error never kills the underlying subscription. Guarded with takeUntilDestroyed().
  - auth-error.util.ts — resolveAuthError(): shared code/status → message resolution, configurable per page via an AuthErrorMap.
  - install Angular Material and added way to navigate back if we get 404 page

- **_Time spent_**: 9 hours.
