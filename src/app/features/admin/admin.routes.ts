import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin-landing'
  },
  {
    path: 'admin-landing',
    loadComponent: () =>
      import('./admin-landing/admin-landing').then((m) => m.AdminLanding)
  }
];
