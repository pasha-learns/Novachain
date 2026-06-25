import { Component, input, output, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-crypto-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './crypto-chart.component.html',
  styleUrl: './crypto-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoChartComponent {
  readonly data = input.required<[number, number][]>();
  readonly title = input<string>('');

  readonly chartClicked = output<string>();

  readonly chartOptions = signal<ApexOptions | null>(null);

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (currentData && Array.isArray(currentData) && currentData.length > 0) {
        this.updateChart(currentData);
      }
    });
  }

  private updateChart(seriesData: [number, number][]): void {
    this.chartOptions.set({
      series: [{ name: 'Цена (USD)', data: seriesData }],
      chart: {
        type: 'area',
        height: 400,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight', width: 2, colors: ['#3b82f6'] },
      xaxis: { type: 'datetime', labels: { style: { colors: '#9ca3af' } } },
      yaxis: {
        labels: {
          formatter: (value: number) => '$' + value.toFixed(2),
          style: { colors: '#9ca3af' }
        }
      },
      theme: { mode: 'dark' },
      tooltip: {
        x: { format: 'dd MMM yyyy HH:mm' },
        y: { formatter: (value: number) => '$' + value.toFixed(2) },
        theme: 'dark'
      }
    });
  }

  onChartClick(): void {
    this.chartClicked.emit('Chart clicked!');
  }
}
