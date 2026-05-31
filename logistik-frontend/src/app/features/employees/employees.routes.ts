import { Routes } from '@angular/router';

export const employeesRoutes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: ':employeeId',
    loadComponent: () => import('./employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent)
  },
  {
    path: ':employeeId/edit',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  }
];
