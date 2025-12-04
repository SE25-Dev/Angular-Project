import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const isSuperuserGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUserDetails();

  if (user && user.superuser) {
    return true;
  }
  return router.parseUrl('/courses'); // Redirect to courses or a forbidden page
};