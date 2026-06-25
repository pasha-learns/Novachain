import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MarketsService } from '../../core/services/markets.service';
import { DataService } from '../../core/services/data.service';
import { MarketsTableComponent } from '../../shared/components/markets-table/markets-table.component';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [MarketsTableComponent],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketsComponent implements OnInit {
  private readonly marketsService = inject(MarketsService);
  public readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    if (this.dataService.marketRows().length > 0) {
      this.isLoading.set(false);
      return;
    }
    this.loadMarkets();
  }

  loadMarkets(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.marketsService.getUsdtPairs().subscribe({
      next: (data) => {
        this.dataService.setMarkets(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load market data.');
        this.isLoading.set(false);
      },
    });
  }

  onPairSelected(symbol: string): void {
    this.dataService.setSymbol(symbol);
    this.router.navigate(['/dashboard']);
  }

  onFavoriteToggled(symbol: string): void {
    this.dataService.toggleFavorite(symbol);
  }
}
