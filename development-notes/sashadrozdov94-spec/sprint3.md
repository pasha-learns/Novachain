# Sprint 3

## (a) What I worked on this sprint:
- **Dependency Injection & Tokens:** Created a custom `InjectionToken` for the Binance API URL and injected it into the data services, decoupling configuration from business logic.
- **Performance Optimization:** Switched core components (`Dashboard`, `Markets`, `CryptoChart`, and `Trade`) to the `ChangeDetectionStrategy.OnPush` strategy, perfectly complementing our Signal-based architecture.
- **Custom Directives:** Developed a custom attribute directive (`appTrendColor`) that reacts to Signal inputs and dynamically formats the UI (e.g., turning price changes green or red).
- **Reactive Forms:** Built a new `TradeComponent` featuring Angular Reactive Forms with a `FormGroup`. 
- **Validation:** Implemented built-in validators (`required`, `min`) for the trade amount and order types, seamlessly displaying validation errors in the template and processing form submissions.
