import { InjectionToken } from '@angular/core';

export const BINANCE_API_URL = new InjectionToken<string>('Binance API URL', {
  providedIn: 'root',
  factory: () => 'https://testnet.binance.vision/api/v3'
});
