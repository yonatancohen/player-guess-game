import { Directive, HostListener, ElementRef, forwardRef } from '@angular/core';
import { AbstractControl, ValidationErrors, NG_VALIDATORS, Validator, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[autoHyphenPhone]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutoHyphenPhoneDirective),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoHyphenPhoneDirective),
      multi: true
    }
  ]
})
export class AutoHyphenPhoneDirective implements Validator, ControlValueAccessor {
  private static readonly PHONE_PATTERN = /^05[0-9]-\d{7}$/;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput() {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value || '';

    // Remove non-digits
    value = value.replace(/\D/g, '');

    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 10);
    }

    input.value = value;
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    return AutoHyphenPhoneDirective.PHONE_PATTERN.test(control.value)
      ? null
      : { invalidPhone: true };
  }

  writeValue(value: any): void {
    if (value) {
      const input = this.el.nativeElement as HTMLInputElement;
      input.value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const input = this.el.nativeElement as HTMLInputElement;
    input.disabled = isDisabled;
  }
}