import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '@shared/feature';
import { map, take } from 'rxjs/operators';

/**
 * Auth Guard
 *
 * Functional route guard that protects routes requiring authentication.
 * If user is not logged in, opens auth modal instead of redirecting.
 *
 * Behavior:
 * - If user is logged in: allows navigation
 * - If user is not logged in: opens auth modal and blocks navigation
 *
 * Usage:
 * ```typescript
 * { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authModalService = inject(AuthModalService);
  const router = inject(Router);

  // Check if user is logged in
  if (authService.isLoggedIn()) {
    return true;
  }

  // Open auth modal with redirect URL
  authModalService.open({ redirectUrl: state.url });

  // Block navigation
  return false;
};

/**
 * Guest Guard
 *
 * Functional route guard for routes that should only be accessible to guests.
 * Redirects logged-in users to home.
 *
 * Usage:
 * ```typescript
 * { path: 'login', component: LoginComponent, canActivate: [guestGuard] }
 * ```
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If logged in, redirect to home
  if (authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};