import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorMessagePipe } from '../../pipes/error-message.pipe';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessagePipe],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements ControlValueAccessor {
  private static nextId = 0;
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  private readonly fieldInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fieldInput');

  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly errors = input<Record<string, string>>({});
  readonly groupErrors = input<ValidationErrors | null>(null);

  protected readonly inputId = `field-${++FormFieldComponent.nextId}`;

  protected readonly innerControl = new FormControl('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.innerControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.onChange(value ?? ''));
  }

  focus(): void {
    this.fieldInputRef().nativeElement.focus();
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

  protected get allErrors(): ValidationErrors | null {
    const merged = {
      ...(this.ngControl?.control?.errors ?? {}),
      ...(this.groupErrors() ?? {}),
    };
    return Object.keys(merged).length ? merged : null;
  }

  protected onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.innerControl.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerControl.disable();
    } else {
      this.innerControl.enable();
    }
  }
}
