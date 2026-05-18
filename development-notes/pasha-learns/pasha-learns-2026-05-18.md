**sprint 1 markets — 18 may 2026**

this week i did the markets page for the team. theres MarketsTableComponent where the parent passes rows with input() and clicks go back up with output() — pairSelected when you click a row, favoriteToggled on the star. MarketsPage is pretty thin, it just calls binance testnet rest on init and hands data to the table. hooked up /markets in routes and the header link.

i tried to do it like sashas crypto chart on dashboard — page holds the data, table only displays stuff and fires events. used input.required for rows, input for favorites set, output for the two events, @for with track on symbol. green/red on 24h change with class binding. put OnPush on the table since parent updates signals anyway.

star button doesnt really do watchlist yet, just toggles local state on the page. dashboard sync later.


websocket !ticker@arr looked like a lot for one week (well even less) so left live updates for sprint 2, rest is fine for now.

copied the [rows] and (pairSelected) wiring from dashboard + crypto-chart, that helped.

sprint 2 i want websocket prices, filter tabs usdt/btc/eth, sorting columns, search in header, real watchlist tied to dashboard, click row goes to trade page.

maybe 5 hours on this part.
