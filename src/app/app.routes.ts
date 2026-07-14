import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'intake-assessment',
    loadComponent: () =>
      import('./layouts/intake-assessment-layout/intake-assessment-layout').then(
        (m) => m.IntakeAssessmentLayout
      ),
    loadChildren: () =>
      import('./features/intake-assessment/intake-assessment.routes').then(
        (m) => m.INTAKE_ASSESSMENT_ROUTES
      )
  },
  {
    path: 'patient',
    loadComponent: () =>
      import('./layouts/patient-layout/patient-layout').then((m) => m.PatientLayout),
    loadChildren: () =>
      import('./features/patient/patient.routes').then((m) => m.PATIENT_ROUTES)
  },
  {
    path: 'provider',
    loadComponent: () =>
      import('./layouts/provider-layout/provider-layout').then((m) => m.ProviderLayout),
    loadChildren: () =>
      import('./features/provider/provider.routes').then((m) => m.PROVIDER_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
