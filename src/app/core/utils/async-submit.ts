import { Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, exhaustMap, finalize, tap } from 'rxjs/operators';

export interface AsyncSubmitHandlers<T> {
  next: (value: T) => void;
  error: (err: unknown) => void;
}

export interface AsyncSubmit<T> {
  readonly isLoading: Signal<boolean>;
  submit(action: () => Observable<T>, handlers: AsyncSubmitHandlers<T>): void;
}

export function injectAsyncSubmit<T>(): AsyncSubmit<T> {
  const isLoading = signal(false);
  const trigger$ = new Subject<{ action: () => Observable<T>; handlers: AsyncSubmitHandlers<T> }>();

  trigger$
    .pipe(
      exhaustMap(({ action, handlers }) => {
        isLoading.set(true);
        return action().pipe(
          tap(value => handlers.next(value)),
          catchError((err: unknown) => {
            handlers.error(err);
            return EMPTY;
          }),
          finalize(() => isLoading.set(false))
        );
      }),
      takeUntilDestroyed()
    )
    .subscribe();

  return {
    isLoading: isLoading.asReadonly(),
    submit: (action, handlers) => trigger$.next({ action, handlers }),
  };
}
