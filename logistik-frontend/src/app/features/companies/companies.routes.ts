import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./company-list/company-list.component').then(m => m.CompanyListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./company-form/company-form.component').then(m => m.CompanyFormComponent)
  },
  {
    path: ':companyId',
    loadComponent: () => import('./company-detail/company-detail.component').then(m => m.CompanyDetailComponent)
  },
  {
    path: ':companyId/edit',
    loadComponent: () => import('./company-form/company-form.component').then(m => m.CompanyFormComponent)
  },
  {
    path: ':companyId/employees',
    loadChildren: () => import('../employees/employees.routes').then(m => m.employeesRoutes)
  }
];
