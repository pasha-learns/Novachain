import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../tokens/environment.token';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  getChartData(symbol: string, days: number): Observable<[number, number][]> {
    let interval = '1h';
    let limit = 720;

    if (days === 1) {
      interval = '5m';
      limit = 288;
    } else if (days === 7) {
      interval = '15m';
      limit = 672;
    }

    return this.http
      .get<number[][]>(`${this.env.binanceApiUrl}/klines`, {
        params: { symbol, interval, limit: limit.toString() },
      })
      .pipe(map((klines) => klines.map((k) => [k[0], Number(k[4])] as [number, number])));
  }
}
