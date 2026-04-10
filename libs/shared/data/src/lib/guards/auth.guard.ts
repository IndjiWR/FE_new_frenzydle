import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '@shared/feature';

/**
 * Auth Guard
 *
 * Functional route guard that protects routes requiring authentication.
 * If user is not logged in, opens auth modal instead of redirecting.
 *
 * Behavior:
 * - If user is logged in: allows navigation
 * - If user is a guest and route has `allowGuest: true` data: allows navigation
 * - If user is not logged in: opens auth modal and blocks navigation
 *
 * Usage:
 * ```typescript
 * // Requires full auth
 * { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
 *
 * // Allows guests (shows teaser content in components)
 * { path: 'user', component: UserComponent, canActivate: [authGuard], data: { allowGuest: true } }
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

  // Check if guests are allowed for this route
  const allowGuest = route.data?.['allowGuest'] === true;
  if (allowGuest && authService.isGuest()) {
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