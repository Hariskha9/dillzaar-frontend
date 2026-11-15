import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];

  return auth.ensureUser().pipe(
    map(isAuthenticated => {

      if (!isAuthenticated) {
        return router.createUrlTree(['/login']);
      }

      const user = auth.getCurrentUser();

      if (user && allowedRoles.includes(user.role)) {
        return true;
      }

      return router.createUrlTree(['/panel/dashboard']);
    })
  );
};
