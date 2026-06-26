# Sprint 2

## (a) What I worked on this sprint:
- Integrated Binance Testnet API to fetch USDT market pairs and historical chart data (klines).
- Created a global `DataService` using Angular Signals to manage application state (caching market data, storing the selected pair, and tracking favorite coins).
- Built a Markets page featuring a dynamic data table with real-time prices, 24h changes, and a favorites toggle.
- Upgraded the `CryptoChartComponent` to support dynamic timeframes with precise candle intervals (5m, 15m, 1h) and fixed rendering accuracy.
- Implemented page-to-page navigation via Angular Router, allowing users to select a pair on the Markets page and view its detailed chart on the Dashboard.
- Fixed ESLint accessibility issues on `CryptoChartComponent` (keyboard support for chart click handler).
- Typed the CoinGecko API response in `CryptoService` to satisfy `@typescript-eslint/no-explicit-any`.
- Cleaned up legacy `NotFoundComponent` scaffold for standalone + lint compliance.
- Helped set up ESLint flat config, CI workflow, and GitHub Pages deployment for the team checkpoint.

## (b) What I learned:
- ESLint flat config (`eslint.config.js`) replaces the old `.eslintrc` format in Angular 21 projects.
- GitHub Pages SPA routing requires copying `index.html` to `404.html` for client-side routes to work.
- A shared signal-based `DataService` keeps markets, dashboard, and trade views in sync without prop drilling.

## (c) Time spent:
- ~4 hours.
