import { Directive, ElementRef, inject, input, effect } from '@angular/core';

@Directive({
  selector: '[appTrendColor]',
  standalone: true
})
export class TrendColorDirective {
  readonly appTrendColor = input.required<number>();
  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      const value = this.appTrendColor();
      if (value > 0) {
        this.el.nativeElement.style.color = '#0ecb81';
      } else if (value < 0) {
        this.el.nativeElement.style.color = '#f6465d';
      } else {
        this.el.nativeElement.style.color = 'inherit';
      }
    });
  }
}
