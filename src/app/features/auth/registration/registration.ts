import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null
    : { passwordMismatch: true };
}

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration {
  @ViewChildren('otpInput') private otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly otpDigits = Array.from({ length: 6 });
  protected readonly passwordVisible = signal(false);
  protected readonly confirmPasswordVisible = signal(false);
  protected readonly otpVerified = signal(false);
  protected readonly registrationForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      otp: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{6}$/)]
      }),
      mobile: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{10,15}$/)]
      }),
      gender: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      state: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
        ]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: passwordsMatch }
  );

  constructor(private readonly router: Router) {}

  protected isInvalid(
    controlName: 'firstName' | 'lastName' | 'email' | 'mobile' | 'gender' | 'state' | 'password'
  ): boolean {
    const control = this.registrationForm.controls[controlName];
    return control.touched && control.invalid;
  }

  protected get isConfirmPasswordInvalid(): boolean {
    const control = this.registrationForm.controls.confirmPassword;
    return control.touched && (control.invalid || this.registrationForm.hasError('passwordMismatch'));
  }

  protected handleOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(-1);
    this.syncOtpControl();

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
        this.syncOtpControl();
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
    this.syncOtpControl();
    this.otpInputs.get(focusIndex)?.nativeElement.focus();
  }

  protected sendVerificationCode(): void {
    this.registrationForm.controls.email.markAsTouched();
  }

  protected verifyCode(): void {
    this.registrationForm.controls.otp.markAsTouched();
    this.otpVerified.set(this.registrationForm.controls.otp.valid);
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((visible) => !visible);
  }

  protected submit(): void {
    if (this.registrationForm.invalid || !this.otpVerified()) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    void this.router.navigate(['/auth/login']);
  }

  private syncOtpControl(): void {
    const value = this.otpInputs
      .map((input) => input.nativeElement.value)
      .join('');

    this.registrationForm.controls.otp.setValue(value);
    this.otpVerified.set(false);
  }
}
