import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard-day-one'
  },
  {
    path: 'dashboard-day-one',
    loadComponent: () =>
      import('./dashboard-day-one/dashboard-day-one').then((m) => m.DashboardDayOne)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.PatientDashboard)
  },
  {
    path: 'medication',
    loadComponent: () =>
      import('./medication/medication').then((m) => m.Medication)
  },
  {
    path: 'dashboard/membership-payment',
    loadComponent: () =>
      import('./dashboard/steps/membership-payment/membership-payment').then(
        (m) => m.MembershipPayment
      )
  },
  {
    path: 'dashboard/doctor-review',
    loadComponent: () =>
      import('./dashboard/steps/doctor-review/doctor-review').then((m) => m.DoctorReview)
  },
  {
    path: 'dashboard/prescription-sent',
    loadComponent: () =>
      import('./dashboard/steps/prescription-sent/prescription-sent').then(
        (m) => m.PrescriptionSent
      )
  }
];
