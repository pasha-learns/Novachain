# Sprint 3

## (a) What I worked on this sprint:
- **Dependency Injection & Tokens:** Created a custom `InjectionToken` for the Binance API URL and injected it into the data services, decoupling configuration from business logic.
- **Performance Optimization:** Switched core components (`Dashboard`, `Markets`, `CryptoChart`, and `Trade`) to the `ChangeDetectionStrategy.OnPush` strategy, perfectly complementing our Signal-based architecture.
- **Reactive Forms:** Built a new `TradeComponent` featuring Angular Reactive Forms with a `FormGroup`.
- **Validation:** Implemented built-in validators (`required`, `min`) for the trade amount and order types, seamlessly displaying validation errors in the template and processing form submissions.
- Created `ChangeColorDirective` — attribute directive with signal `input()` and `@HostBinding` for `positive` / `negative` CSS classes based on a numeric value (24h change %).
- Applied the directive on the markets table change column, replacing manual `[class.positive]` / `[class.negative]` bindings in the template.
- Added `ChangeDetectionStrategy.OnPush` to `DashboardComponent` — parent updates chart data via signals, so unnecessary CD cycles are skipped.

## (b) What I learned:
- Attribute directives can replace repetitive class bindings when the same positive/negative logic is reused across cells.
- `@HostBinding` on a getter re-evaluates when the bound `input()` signal changes, which works cleanly with OnPush child components.
- Reactive forms pair well with route params when the selected pair is synced via `effect()` and `patchValue()`.

## (c) Time spent:
- ~4 hours.
