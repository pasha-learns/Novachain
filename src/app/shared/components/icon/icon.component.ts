import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @if (isSvg()) {
      <span [innerHTML]="svgContent()"></span>
    } @else {
      <img [src]="src()" [attr.alt]="alt()" [attr.width]="width()" [attr.height]="height()" />
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    span ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `],
  host: {
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  readonly src = input.required<string>();
  readonly width = input<number>(24);
  readonly height = input<number>(24);
  readonly alt = input<string>('');

  protected readonly isSvg = computed(() => this.src().toLowerCase().endsWith('.svg'));
  protected readonly svgContent = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      if (this.isSvg()) {
        this.http.get(this.src(), { responseType: 'text' }).subscribe(svg => {
          this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(svg));
        });
      }
    });
  }
}
