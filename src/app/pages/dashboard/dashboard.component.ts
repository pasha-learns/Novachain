import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { CryptoChartComponent } from '../../shared/components/crypto-chart/crypto-chart.component';
import { CryptoService } from '../../core/services/crypto.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly cryptoService = inject(CryptoService);
  public readonly dataService = inject(DataService);

  readonly chartData = signal<[number, number][]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedDays = signal<number>(7);
  readonly interactionMessage = signal<string>('');

  constructor() {
    effect(() => {
      const symbol = this.dataService.selectedSymbol();
      this.loadData(symbol, this.selectedDays());
    });
  }

  ngOnInit(): void {}

  loadData(symbol: string, days: number): void {
    this.selectedDays.set(days);
    this.isLoading.set(true);

    this.cryptoService.getChartData(symbol, days).subscribe({
      next: (data) => {
        this.chartData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  handleUserInteraction(message: string): void {
    this.interactionMessage.set(message);
    setTimeout(() => this.interactionMessage.set(''), 3000);
  }
}
