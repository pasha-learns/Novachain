import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
})
export class TradeComponent {
  private readonly route = inject(ActivatedRoute);

  readonly symbol = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('symbol') ?? '')),
    { initialValue: '' }
  );

  readonly displaySymbol = computed(() => {
    const raw = this.symbol();
    if (!raw) return '';
    if (raw.endsWith('USDT')) {
      return `${raw.slice(0, -4)} / USDT`;
    }
    return raw;
  });
}
