import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PairSymbolPipe } from '../../shared/pipes/pair-symbol.pipe';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [RouterLink, PairSymbolPipe],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent {
  private readonly route = inject(ActivatedRoute);

  readonly symbol = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('symbol') ?? '')),
    { initialValue: '' },
  );
}
