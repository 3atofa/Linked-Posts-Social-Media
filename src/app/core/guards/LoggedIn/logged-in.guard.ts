import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Check if we're in a browser environment
  if (isPlatformBrowser(platformId)) {
    if(localStorage.getItem('socialToken') != null) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  } else {
    // If not in browser (SSR), allow access to auth pages
    return true;
  }
};
