import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pairSymbol',
  standalone: true,
})
export class PairSymbolPipe implements PipeTransform {
  transform(symbol: string, quote = 'USDT'): string {
    if (!symbol) return '';
    if (symbol.endsWith(quote)) {
      return `${symbol.slice(0, -quote.length)} / ${quote}`;
    }
    return symbol;
  }
}
