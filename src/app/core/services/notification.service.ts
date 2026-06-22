import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _message = signal<string | null>(null);
  readonly message = this._message.asReadonly();

  private timeoutId?: ReturnType<typeof setTimeout>;

  show(text: string, duration = 4000): void {
    clearTimeout(this.timeoutId);
    this._message.set(text);
    this.timeoutId = setTimeout(() => this._message.set(null), duration);
  }
}
