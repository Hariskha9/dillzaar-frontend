import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 
  const token = localStorage.getItem('dillzaar_token');

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
