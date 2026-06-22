import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[appChangeColor]',
  standalone: true,
})
export class ChangeColorDirective {
  readonly appChangeColor = input.required<number>();

  @HostBinding('class.positive')
  get isPositive(): boolean {
    return this.appChangeColor() >= 0;
  }

  @HostBinding('class.negative')
  get isNegative(): boolean {
    return this.appChangeColor() < 0;
  }
}
