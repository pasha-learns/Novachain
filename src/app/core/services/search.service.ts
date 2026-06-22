import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');

  set(value: string): void {
    this.query.set(value.toLowerCase().trim());
  }

  clear(): void {
    this.query.set('');
  }
}
