export interface MarketRow {
  symbol: string;
  price: number;
  changePercent24h: number;
  volume24h: number;
}

export interface BinanceTicker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}
