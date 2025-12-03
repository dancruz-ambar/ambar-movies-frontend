import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const handleUnauthorizedError = () => {
    authService.logout();
    sessionStorage.setItem('session_expired', 'true');
    router.navigate(['/login']);
  };

  const clonedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error in interceptor', error);
      if (error.status === 401) handleUnauthorizedError();
      return throwError(() => error);
    })
  );
};
