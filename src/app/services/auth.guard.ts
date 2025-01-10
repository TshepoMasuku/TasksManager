import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedUser = localStorage.getItem('loggedUser');

  if(loggedUser !== null) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
