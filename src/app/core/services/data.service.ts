import { Injectable, signal, computed } from '@angular/core';
import { MarketRow } from '../models/market.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly selectedSymbol = signal<string>('ETHUSDT');

  readonly marketRows = signal<MarketRow[]>([]);
  readonly favoriteSymbols = signal<Set<string>>(new Set());

  readonly favoriteMarkets = computed(() => {
    const rows = this.marketRows();
    const favs = this.favoriteSymbols();
    return rows.filter(row => favs.has(row.symbol));
  });

  readonly selectedMarketData = computed(() => {
    const rows = this.marketRows();
    const currentSymbol = this.selectedSymbol();
    return rows.find(row => row.symbol === currentSymbol) || null;
  });

  setSymbol(symbol: string): void {
    this.selectedSymbol.set(symbol);
  }

  setMarkets(markets: MarketRow[]): void {
    this.marketRows.set(markets);
  }

  toggleFavorite(symbol: string): void {
    this.favoriteSymbols.update(current => {
      const next = new Set(current);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  }
}
