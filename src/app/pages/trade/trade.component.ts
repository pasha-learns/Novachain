import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeComponent {
  private readonly fb = inject(FormBuilder);

  readonly tradeForm = this.fb.group({
    pair: ['ETHUSDT', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    orderType: ['market', Validators.required]
  });

  onSubmit(): void {
    if (this.tradeForm.valid) {
      console.log('Order submitted:', this.tradeForm.value);
      this.tradeForm.reset({ pair: 'ETHUSDT', amount: 0, orderType: 'market' });
    } else {
      this.tradeForm.markAllAsTouched();
    }
  }
}
