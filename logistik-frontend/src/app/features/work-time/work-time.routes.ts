import { Routes } from '@angular/router';

export const workTimeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./work-time-page/work-time-page.component').then(m => m.WorkTimePageComponent)
  }
];
