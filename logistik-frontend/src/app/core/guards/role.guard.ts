import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user?.role === requiredRole) return true;
    return router.createUrlTree(['/']);
  };
};

// Restricts a route to the single admin USER account (username 'admin'),
// not every user with the Admin role.
export const adminUserGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.currentUser()?.username === 'admin') return true;
  return router.createUrlTree(['/']);
};
