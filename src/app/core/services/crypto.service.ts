import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private http = inject(HttpClient);

  getEthPriceHistory(days = 7): Observable<[number, number][]> {
    return this.http
      .get<{ prices: [number, number][] }>(`${environment.apiUrl}/coins/ethereum/market_chart`, {
        params: { vs_currency: 'usd', days: days.toString() },
      })
      .pipe(map((response) => response.prices));
  }
}
