import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  readonly rows = signal<MarketRow[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly favoriteSymbols = signal<Set<string>>(new Set());
  readonly favoriteCount = computed(() => this.favoriteSymbols().size);

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
