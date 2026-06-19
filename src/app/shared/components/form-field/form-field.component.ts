import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent implements ControlValueAccessor {
  private static nextId = 0;
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @ViewChild('fieldInput') private fieldInputRef!: ElementRef<HTMLInputElement>;

  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly errors = input<Record<string, string>>({});
  readonly groupErrors = input<ValidationErrors | null>(null);

  protected readonly inputId = `field-${++FormFieldComponent.nextId}`;
  protected innerValue = '';
  protected isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  focus(): void {
    this.fieldInputRef.nativeElement.focus();
  }

  protected get isTouched(): boolean {
    return this.ngControl?.control?.touched ?? false;
  }

  protected get isInvalid(): boolean {
    if (!this.isTouched) return false;
    const hasControlErrors = !!this.ngControl?.control?.errors;
    const hasGroupError = Object.keys(this.groupErrors() ?? {}).some(
      key => this.errors()[key] !== undefined
    );
    return hasControlErrors || hasGroupError;
  }

  protected get activeError(): string | null {
    if (!this.isTouched) return null;
    const allErrors = {
      ...(this.ngControl?.control?.errors ?? {}),
      ...(this.groupErrors() ?? {}),
    };
    for (const key of Object.keys(this.errors())) {
      if (allErrors[key]) return this.errors()[key];
    }
    return null;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.innerValue = value;
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
