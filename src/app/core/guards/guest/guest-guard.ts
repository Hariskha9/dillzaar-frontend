import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/panel']);
  }

  return true;
};
