import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Users without any assigned company shouldn't see the companies section at all.
export const companiesAccessGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user?.role === 'Admin') return true;
  if ((user?.assignedCompanyIds?.length ?? 0) > 0) return true;
  return router.createUrlTree(['/work-time']);
};
