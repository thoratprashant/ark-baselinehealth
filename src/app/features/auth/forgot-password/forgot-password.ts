import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  protected readonly forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(private readonly router: Router) {}

  protected get isEmailInvalid(): boolean {
    const control = this.forgotPasswordForm.controls.email;
    return control.touched && control.invalid;
  }

  protected submit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    void this.router.navigate(['/auth/reset-password'], {
      queryParams: { email: this.forgotPasswordForm.controls.email.value }
    });
  }
}
