import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (notification.message(); as text) {
      <div class="toast" role="alert" aria-live="assertive">{{ text }}</div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 8px;
      background: #ef4444;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      z-index: 9999;
    }
  `],
})
export class ToastComponent {
  protected readonly notification = inject(NotificationService);
}
