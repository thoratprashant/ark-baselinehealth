import { Component, DestroyRef, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

type ProfileControlName = 'firstName' | 'lastName' | 'email' | 'mobile' | 'state' | 'gender';
type PharmacyControlName = 'pharmacyName' | 'zipCode';

@Component({
  selector: 'app-patient-profile',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class PatientProfile {
  private readonly destroyRef = inject(DestroyRef);
  private readonly transientTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly profileControlNames: ProfileControlName[] = [
    'firstName',
    'lastName',
    'email',
    'mobile',
    'state',
    'gender',
  ];
  private readonly pharmacyControlNames: PharmacyControlName[] = ['pharmacyName', 'zipCode'];

  protected readonly profileSaved = signal(false);
  protected readonly pharmacySearchComplete = signal(false);
  protected readonly pharmacySaved = signal(false);
  protected readonly isEditingProfile = signal(false);
  protected readonly renewalPreference = signal<'auto' | 'manual'>('auto');
  protected readonly profileSuccessFields = signal<ReadonlySet<ProfileControlName>>(new Set());
  protected readonly pharmacySuccessFields = signal<ReadonlySet<PharmacyControlName>>(new Set());

  protected readonly profileForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    mobile: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{10,15}$/)],
    }),
    state: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly pharmacyForm = new FormGroup({
    pharmacyName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    zipCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{5}$/)],
    }),
  });

  constructor() {
    this.profileForm.disable({ emitEvent: false });

    this.destroyRef.onDestroy(() => {
      this.transientTimers.forEach((timer) => clearTimeout(timer));
    });
  }

  protected profileInvalid(controlName: ProfileControlName): boolean {
    const control = this.profileForm.controls[controlName];
    return control.touched && control.invalid;
  }

  protected profileValid(controlName: ProfileControlName): boolean {
    return this.profileSuccessFields().has(controlName);
  }

  protected pharmacyInvalid(controlName: PharmacyControlName): boolean {
    const control = this.pharmacyForm.controls[controlName];
    return control.touched && control.invalid;
  }

  protected pharmacyValid(controlName: PharmacyControlName): boolean {
    return this.pharmacySuccessFields().has(controlName);
  }

  protected showProfileFieldSuccess(controlName: ProfileControlName): void {
    const control = this.profileForm.controls[controlName];
    control.markAsTouched();
    this.clearProfileSuccess(controlName);

    if (control.valid) {
      this.addTransientField(
        `profile-field-${controlName}`,
        this.profileSuccessFields,
        controlName,
      );
    }
  }

  protected showPharmacyFieldSuccess(controlName: PharmacyControlName): void {
    const control = this.pharmacyForm.controls[controlName];
    control.markAsTouched();
    this.clearPharmacyMessages(controlName);

    if (control.valid) {
      this.addTransientField(
        `pharmacy-field-${controlName}`,
        this.pharmacySuccessFields,
        controlName,
      );
    }
  }

  protected handleProfileAction(): void {
    if (!this.isEditingProfile()) {
      this.clearStatus('profile-saved', this.profileSaved);
      this.profileForm.enable({ emitEvent: false });
      this.isEditingProfile.set(true);
      return;
    }

    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      return;
    }

    this.profileControlNames.forEach((controlName) => this.showProfileFieldSuccess(controlName));
    this.showTransientStatus('profile-saved', this.profileSaved, true);
    this.profileForm.disable({ emitEvent: false });
    this.isEditingProfile.set(false);
  }

  protected searchPharmacy(): void {
    this.pharmacyForm.markAllAsTouched();

    if (this.pharmacyForm.valid) {
      this.pharmacyControlNames.forEach((controlName) =>
        this.showPharmacyFieldSuccess(controlName),
      );
    }

    this.showTransientStatus(
      'pharmacy-search-complete',
      this.pharmacySearchComplete,
      this.pharmacyForm.valid,
    );
    this.clearStatus('pharmacy-saved', this.pharmacySaved);
  }

  protected savePharmacy(): void {
    this.showTransientStatus('pharmacy-saved', this.pharmacySaved, true);
  }

  protected clearProfileSuccess(controlName?: ProfileControlName): void {
    this.clearStatus('profile-saved', this.profileSaved);

    if (controlName) {
      this.removeTransientField(
        `profile-field-${controlName}`,
        this.profileSuccessFields,
        controlName,
      );
    }
  }

  protected clearPharmacyMessages(controlName?: PharmacyControlName): void {
    this.clearStatus('pharmacy-search-complete', this.pharmacySearchComplete);
    this.clearStatus('pharmacy-saved', this.pharmacySaved);

    if (controlName) {
      this.removeTransientField(
        `pharmacy-field-${controlName}`,
        this.pharmacySuccessFields,
        controlName,
      );
    }
  }

  private addTransientField<T>(
    timerKey: string,
    fields: WritableSignal<ReadonlySet<T>>,
    field: T,
  ): void {
    fields.update((currentFields) => new Set(currentFields).add(field));
    this.scheduleReset(timerKey, () => {
      fields.update((currentFields) => {
        const nextFields = new Set(currentFields);
        nextFields.delete(field);
        return nextFields;
      });
    });
  }

  private removeTransientField<T>(
    timerKey: string,
    fields: WritableSignal<ReadonlySet<T>>,
    field: T,
  ): void {
    this.clearTimer(timerKey);
    fields.update((currentFields) => {
      const nextFields = new Set(currentFields);
      nextFields.delete(field);
      return nextFields;
    });
  }

  private showTransientStatus(
    timerKey: string,
    status: WritableSignal<boolean>,
    visible: boolean,
  ): void {
    this.clearTimer(timerKey);
    status.set(visible);

    if (visible) {
      this.scheduleReset(timerKey, () => status.set(false));
    }
  }

  private clearStatus(timerKey: string, status: WritableSignal<boolean>): void {
    this.clearTimer(timerKey);
    status.set(false);
  }

  private scheduleReset(timerKey: string, reset: () => void): void {
    this.clearTimer(timerKey);
    const timer = setTimeout(() => {
      reset();
      this.transientTimers.delete(timerKey);
    }, 2000);
    this.transientTimers.set(timerKey, timer);
  }

  private clearTimer(timerKey: string): void {
    const timer = this.transientTimers.get(timerKey);

    if (timer) {
      clearTimeout(timer);
      this.transientTimers.delete(timerKey);
    }
  }
}
