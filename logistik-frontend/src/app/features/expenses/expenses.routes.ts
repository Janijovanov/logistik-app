import { Routes } from '@angular/router';

export const expensesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./expenses-page/expenses-page.component').then(m => m.ExpensesPageComponent),
    data: { scope: 0, titleKey: 'expenses.title' }
  }
];
