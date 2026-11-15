import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { map } from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
   const auth = inject(Auth);
  const router = inject(Router);

  return auth.ensureUser().pipe(
    map(isAuthenticated => {

      if (isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
