import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MarketRow } from '../../core/models/market.model';
import { MarketsService } from '../../core/services/markets.service';
import { SearchService } from '../../core/services/search.service';
import { QUOTE_CURRENCY } from '../../core/tokens/quote-currency.token';
import { MarketsTableComponent } from '../../shared/components/markets-table/markets-table.component';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [MarketsTableComponent],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent implements OnInit, OnDestroy {
  private readonly marketsService = inject(MarketsService);
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);
  readonly quoteCurrency = inject(QUOTE_CURRENCY);

  readonly rows = signal<MarketRow[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly favoriteSymbols = signal<Set<string>>(new Set());
  readonly favoriteCount = computed(() => this.favoriteSymbols().size);

  readonly filteredRows = computed(() => {
    const query = this.searchService.query();
    if (!query) return this.rows();
    return this.rows().filter(
      (row) =>
        row.symbol.toLowerCase().includes(query) ||
        String(row.price).includes(query) ||
        String(row.changePercent24h).includes(query) ||
        String(row.volume24h).includes(query),
    );
  });

  ngOnInit(): void {
    this.loadMarkets();
  }

  ngOnDestroy(): void {
    this.searchService.clear();
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
    this.router.navigate(['/trade', symbol]);
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
