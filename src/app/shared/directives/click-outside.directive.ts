import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);

  readonly clickOutside = output<void>();

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
