import { Component, inject, OnInit, signal } from '@angular/core';
import { MarketRow } from '../../core/models/market.model';
import { MarketsService } from '../../core/services/markets.service';
import { MarketsTableComponent } from '../../shared/components/markets-table/markets-table.component';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [MarketsTableComponent],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent implements OnInit {
  private readonly marketsService = inject(MarketsService);

  readonly rows = signal<MarketRow[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly favoriteSymbols = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadMarkets();
  }

  loadMarkets(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.marketsService.getUsdtPairs().subscribe({
      next: (data) => {
        this.rows.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load market data. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  onPairSelected(symbol: string): void {
    console.log('Sprint 2: navigate to trade for', symbol);
  }

  onFavoriteToggled(symbol: string): void {
    this.favoriteSymbols.update((current) => {
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
