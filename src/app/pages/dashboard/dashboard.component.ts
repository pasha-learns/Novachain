import { Component, inject, OnInit, signal } from '@angular/core';
import { CryptoChartComponent } from '../../shared/components/crypto-chart/crypto-chart.component';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly cryptoService = inject(CryptoService);

  readonly chartData = signal<[number, number][]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedDays = signal<number>(7);
  readonly interactionMessage = signal<string>('');

  ngOnInit(): void {
    this.loadData(this.selectedDays());
  }

  loadData(days: number): void {
    this.selectedDays.set(days);
    this.isLoading.set(true);

    this.cryptoService.getEthPriceHistory(days).subscribe({
      next: (data) => {
        this.chartData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ошибка при загрузке API', err);
        this.isLoading.set(false);
      }
    });
  }

  handleUserInteraction(message: string): void {
    this.interactionMessage.set(message);
    setTimeout(() => this.interactionMessage.set(''), 3000);
  }
}
