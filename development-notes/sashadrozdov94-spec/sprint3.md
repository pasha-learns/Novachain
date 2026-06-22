# Sprint 3

## (a) What I worked on this sprint:
- Created `ChangeColorDirective` — attribute directive with signal `input()` and `@HostBinding` for `positive` / `negative` CSS classes based on a numeric value (24h change %).
- Applied the directive on the markets table change column, replacing manual `[class.positive]` / `[class.negative]` bindings in the template.
- Added `ChangeDetectionStrategy.OnPush` to `DashboardComponent` — parent updates chart data via signals, so unnecessary CD cycles are skipped.

## (b) What I learned:
- Attribute directives can replace repetitive class bindings when the same positive/negative logic is reused across cells.
- `@HostBinding` on a getter re-evaluates when the bound `input()` signal changes, which works cleanly with OnPush child components.

## (c) Time spent:
- ~2 hours.
