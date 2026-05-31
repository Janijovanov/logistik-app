import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'companies',
        loadChildren: () => import('./features/companies/companies.routes').then(m => m.companiesRoutes)
      },
      {
        path: 'users',
        canActivate: [roleGuard('Admin')],
        loadChildren: () => import('./features/users/users.routes').then(m => m.usersRoutes)
      },
      { path: '', redirectTo: 'companies', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
