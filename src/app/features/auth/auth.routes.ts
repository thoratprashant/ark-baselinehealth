import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login)
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./registration/registration').then((m) => m.Registration)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password').then((m) => m.ForgotPassword)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password').then((m) => m.ResetPassword)
  }
];
