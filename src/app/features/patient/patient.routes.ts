import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'patient-landing'
  },
  {
    path: 'patient-landing',
    loadComponent: () =>
      import('./patient-landing/patient-landing').then((m) => m.PatientLanding)
  }
];
