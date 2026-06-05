# Sprint 2

## (a) What I worked on this sprint:
- Integrated Binance Testnet API to fetch USDT market pairs and historical chart data (klines).
- Created a global `DataService` using Angular Signals to manage application state (caching market data, storing the selected pair, and tracking favorite coins).
- Built a Markets page featuring a dynamic data table with real-time prices, 24h changes, and a favorites toggle.
- Upgraded the `CryptoChartComponent` to support dynamic timeframes with precise candle intervals (5m, 15m, 1h) and fixed rendering accuracy.
- Implemented page-to-page navigation via Angular Router, allowing users to select a pair on the Markets page and view its detailed chart on the Dashboard.
