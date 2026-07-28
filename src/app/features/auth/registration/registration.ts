import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration {
  @ViewChildren('otpInput') private otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly passwordVisible = signal(false);
  protected readonly confirmPasswordVisible = signal(false);

  protected handleOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(-1);

    if (input.value) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  protected handleOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const previousInput = this.otpInputs.get(index - 1)?.nativeElement;

      if (previousInput) {
        previousInput.value = '';
        previousInput.focus();
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }

    if (event.key === 'ArrowRight' && index < this.otpInputs.length - 1) {
      event.preventDefault();
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  protected handleOtpPaste(event: ClipboardEvent, startIndex: number): void {
    const digits = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6 - startIndex);

    if (!digits) {
      return;
    }

    event.preventDefault();

    for (const [offset, digit] of [...digits].entries()) {
      const input = this.otpInputs.get(startIndex + offset)?.nativeElement;

      if (input) {
        input.value = digit;
      }
    }

    const focusIndex = Math.min(startIndex + digits.length, this.otpInputs.length - 1);
    this.otpInputs.get(focusIndex)?.nativeElement.focus();
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((visible) => !visible);
  }
}
