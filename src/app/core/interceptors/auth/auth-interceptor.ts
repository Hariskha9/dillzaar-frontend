import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const platformId = inject(PLATFORM_ID);
  let token: string | null = null;

   // Access localStorage only in the browser
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('khanibykhanam_token');
  }
  let authReq = req.clone({
    setHeaders: {
      Accept: 'application/json'
    }
  });

  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq);
};
