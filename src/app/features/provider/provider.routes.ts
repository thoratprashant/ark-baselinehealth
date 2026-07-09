import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'provider-landing'
  },
  {
    path: 'provider-landing',
    loadComponent: () =>
      import('./provider-landing/provider-landing').then((m) => m.ProviderLanding)
  }
];
