import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from './services/profile.service';

export const tokenGuard: CanActivateFn = (route, state) => {
  const token = inject(ProfileService).checkUserToken();
  if (token != null) return true;
  else {
    inject(Router).navigateByUrl('/login');
    return false;
  }
};
