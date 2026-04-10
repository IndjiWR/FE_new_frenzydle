import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * CSRF Interceptor
 *
 * Adds X-CSRF-Token header to all mutating requests (POST, PUT, DELETE, PATCH).
 * The token is fetched from the AuthService, which retrieves it from the backend
 * during app initialization.
 *
 * Backend Implementation Notes:
 * - Provide GET /api/auth/csrf that returns { token: string, expiresAt: string }
 * - Tokens should be rotated periodically for security
 * - The token should be validated on every mutating request
 * - Consider implementing Double Submit Cookie pattern for additional security
 *
 * Security:
 * - CSRF tokens protect against Cross-Site Request Forgery attacks
 * - Required for all state-changing operations
 * - Token must match the one stored in the user's session/httpOnly cookie
 */
export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  // Only add CSRF token for mutating methods
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (!mutatingMethods.includes(request.method)) {
    return next(request);
  }

  // Get CSRF token from AuthService
  // The AuthService stores the token in memory after fetching it from /api/auth/csrf
  try {
    const authService = inject(AuthService);
    const csrfToken = authService.csrfToken();

    if (csrfToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          'X-CSRF-Token': csrfToken,
        },
      });
      return next(clonedRequest);
    }
  } catch {
    // AuthService not available yet (during app initialization)
    // Fall through to meta tag approach
  }

  // Fallback: Try to get CSRF token from meta tag (for SSR or early requests)
  const metaToken = getCsrfTokenFromMeta();
  if (metaToken) {
    const clonedRequest = request.clone({
      setHeaders: {
        'X-CSRF-Token': metaToken,
      },
    });
    return next(clonedRequest);
  }

  // No CSRF token available - proceed without it
  // The backend should reject the request if CSRF protection is required
  return next(request);
};

/**
 * Get CSRF token from meta tag (for SSR or before AuthService is ready)
 */
function getCsrfTokenFromMeta(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag?.getAttribute('content') ?? null;
}