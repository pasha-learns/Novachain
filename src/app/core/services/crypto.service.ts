import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../tokens/environment.token';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  getEthPriceHistory(days = 7): Observable<[number, number][]> {
    return this.http
      .get<{ prices: [number, number][] }>(`${this.env.apiUrl}/coins/ethereum/market_chart`, {
        params: { vs_currency: 'usd', days: days.toString() },
      })
      .pipe(map((response) => response.prices));
  }
}
