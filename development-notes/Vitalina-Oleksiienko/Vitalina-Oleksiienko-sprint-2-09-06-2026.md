# Sprint 2 Routing & Auth Guards

- **_What was done_**:
  Re-enabled `authGuard` on `/dashboard` so the route is protected again after it was temporarily commented out during Sprint 1 integration.
  Fixed `RegisterComponent` redirect from broken `/settings` to `/dashboard` after successful signup.
  Verified `guestGuard` still redirects authenticated users away from `/login` and `/register`.

- **_Problems_**:
  Register was navigating to a route that did not exist, which sent new users to the 404 page.

- **_Solutions_**:
  Changed post-registration navigation to `/dashboard`, consistent with login flow.

- **_What I learned_**:
  Route guards are only effective when actually attached to routes in `app.routes.ts` — having the guard function defined is not enough.
  Always verify redirect targets exist in the route config before shipping auth flows.

- **_Time spent_**: 1 hour.
