import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BinanceTicker24hr, MarketRow } from '../models/market.model';
import { ENVIRONMENT } from '../tokens/environment.token';

@Injectable({ providedIn: 'root' })
export class MarketsService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  getUsdtPairs(): Observable<MarketRow[]> {
    return this.http
      .get<BinanceTicker24hr[]>(`${this.env.binanceApiUrl}/ticker/24hr`)
      .pipe(
        map((tickers) =>
          tickers
            .filter((t) => t.symbol.endsWith('USDT'))
            .map((t) => ({
              symbol: t.symbol,
              price: Number(t.lastPrice),
              changePercent24h: Number(t.priceChangePercent),
              volume24h: Number(t.quoteVolume),
            }))
            .filter((row) => row.price > 0)
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, 100),
        ),
      );
  }
}
