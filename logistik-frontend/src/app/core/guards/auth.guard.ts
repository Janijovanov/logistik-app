import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAccessTokenValid() && authService.isLoggedIn()) {
    return true;
  }

  tokenService.clearTokens();
  return router.createUrlTree(['/login']);
};
