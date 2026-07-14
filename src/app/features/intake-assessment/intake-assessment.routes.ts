import { Routes } from '@angular/router';

export const INTAKE_ASSESSMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./intake-assessment').then((component) => component.IntakeAssessment)
  }
];
