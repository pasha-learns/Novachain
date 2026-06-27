import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PairSymbolPipe } from '../../shared/pipes/pair-symbol.pipe';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [RouterLink, PairSymbolPipe, ReactiveFormsModule],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly symbol = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('symbol') ?? '')),
    { initialValue: '' },
  );

  readonly tradeForm = this.fb.group({
    pair: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    orderType: ['market', Validators.required],
  });

  constructor() {
    effect(() => {
      const symbol = this.symbol();
      if (symbol) {
        this.tradeForm.patchValue({ pair: symbol });
      }
    });
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      console.log('Order submitted:', this.tradeForm.value);
      this.tradeForm.reset({ pair: this.symbol(), amount: 0, orderType: 'market' });
    } else {
      this.tradeForm.markAllAsTouched();
    }
  }
}
