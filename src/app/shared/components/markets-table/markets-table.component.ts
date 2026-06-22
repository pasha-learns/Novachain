import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MarketRow } from '../../../core/models/market.model';
import { ChangeColorDirective } from '../../directives/change-color.directive';
import { PairSymbolPipe } from '../../pipes/pair-symbol.pipe';

@Component({
  selector: 'app-markets-table',
  standalone: true,
  imports: [DecimalPipe, PairSymbolPipe, ChangeColorDirective],
  templateUrl: './markets-table.component.html',
  styleUrl: './markets-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsTableComponent {
  readonly rows = input.required<MarketRow[]>();
  readonly favoriteSymbols = input<ReadonlySet<string>>(new Set());

  readonly pairSelected = output<string>();
  readonly favoriteToggled = output<string>();

  onRowClick(symbol: string, event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.favorite-btn')) {
      return;
    }
    this.pairSelected.emit(symbol);
  }

  onFavoriteClick(symbol: string, event: Event): void {
    event.stopPropagation();
    this.favoriteToggled.emit(symbol);
  }

  isFavorite(symbol: string): boolean {
    return this.favoriteSymbols().has(symbol);
  }
}
