import { inject, Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of, tap, firstValueFrom, switchMap } from 'rxjs';
import { signal, computed } from '@angular/core';
import {
  UserProfile,
  LoginRequest,
  RegisterRequest,
  ConvertGuestRequest,
  CheckEmailRequest,
  CheckEmailResponse,
  AuthResponse,
  LogoutResponse,
  CsrfResponse,
  ApiResponse,
} from '../models';

/**
 * Auth environment configuration interface
 */
export interface AuthEnvironment {
  production: boolean;
  apiBaseUrl: string;
  useMocks: boolean;
  simulateError?: boolean;  // Optional: for testing error states
}

/**
 * Error codes returned by the backend
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS'
  | 'INVALID_GOOGLE_TOKEN'
  | 'NOT_GUEST'
  | 'SESSION_EXPIRED'
  | 'CSRF_INVALID'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR';

/**
 * Authentication error class
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Token for environment configuration injection
 */
/**
 * InjectionToken for environment configuration
 */
export const ENVIRONMENT = new InjectionToken<AuthEnvironment>('ENVIRONMENT');

/**
 * Default environment configuration (development)
 */
const DEFAULT_ENV: AuthEnvironment = {
  production: false,
  apiBaseUrl: '/api',
  useMocks: true,
};

/**
 * Authentication state management service.
 *
 * Uses Angular signals exclusively - NO localStorage for tokens.
 * All auth state is stored in memory and resets on page refresh.
 *
 * On cold start: calls GET /api/auth/me
 * - If 200: session restored from httpOnly cookie
 * - If 401: creates new guest session via POST /api/auth/guest
 *
 * Security notes:
 * - Sessions managed via httpOnly cookies (server-side)
 * - CSRF tokens required for all mutating requests
 * - No sensitive data stored in localStorage/sessionStorage
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string;
  private readonly useMocks: boolean;

  // Signal-based state (memory only, no localStorage)
  private readonly _currentUser = signal<UserProfile | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _isInitialized = signal(false);
  private readonly _csrfToken = signal<string | null>(null);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isInitialized = this._isInitialized.asReadonly();
  readonly csrfToken = this._csrfToken.asReadonly();

  // Computed signals for convenience
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isGuest = computed(() => this._currentUser()?.isGuest ?? true);
  readonly displayName = computed(() => this._currentUser()?.displayName ?? 'Guest');
  readonly userEmail = computed(() => this._currentUser()?.email ?? null);

  constructor(
    @Optional() @Inject(ENVIRONMENT) environment: AuthEnvironment
  ) {
    const env = environment ?? DEFAULT_ENV;
    this.baseUrl = env.apiBaseUrl;
    this.useMocks = env.useMocks;
  }

  /**
   * Initialize auth state - called by APP_INITIALIZER
   * Must complete before app renders
   */
  async initialize(): Promise<void> {
    if (this._isInitialized()) {
      return;
    }

    this._isLoading.set(true);

    try {
      // Fetch CSRF token first (skip in mock mode - handled by interceptor)
      if (!this.useMocks) {
        await firstValueFrom(this.fetchCsrfToken());
      }

      // Try to restore existing session
      const user = await firstValueFrom(this.getCurrentUser());

      if (user) {
        this._currentUser.set(user);
      } else {
        // No existing session - create guest
        const guestUser = await firstValueFrom(this.createGuestSession());
        this._currentUser.set(guestUser);
      }

      this._isInitialized.set(true);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Try to create guest session as fallback
      try {
        const guestUser = await firstValueFrom(this.createGuestSession());
        this._currentUser.set(guestUser);
        this._isInitialized.set(true);
      } catch (guestError) {
        console.error('Failed to create guest session:', guestError);
      }
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Fetch CSRF token for mutating requests
   */
  private fetchCsrfToken(): Observable<string> {
    return this.http.get<ApiResponse<CsrfResponse>>(`${this.baseUrl}/auth/csrf`).pipe(
      map(response => response.data.token),
      tap(token => this._csrfToken.set(token)),
      catchError(error => {
        console.error('Failed to fetch CSRF token:', error);
        // In production, this should fail - no fallback
        // In development with mocks, the interceptor handles it
        if (this.useMocks) {
          this._csrfToken.set('mock-csrf-token');
          return of('mock-csrf-token');
        }
        throw new AuthError(
          'Failed to fetch CSRF token',
          'CSRF_INVALID',
          error.status || 500
        );
      })
    );
  }

  /**
   * Get current user from session
   */
  private getCurrentUser(): Observable<UserProfile | null> {
    return this.http.get<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/me`).pipe(
      map(response => response.data.user),
      catchError(() => of(null))
    );
  }

  /**
   * Create a new guest session
   */
  createGuestSession(): Observable<UserProfile> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/guest`, {}).pipe(
      map(response => response.data.user),
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw this.handleError(error, 'Failed to create guest session');
      })
    );
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<UserProfile> {
    this._isLoading.set(true);
    const request: LoginRequest = { email, password };

    return this.http.post<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/login`, request).pipe(
      map(response => response.data.user),
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw this.handleError(error, 'Login failed');
      })
    );
  }

  /**
   * Register a new account
   */
  register(email: string, password: string, displayName: string): Observable<UserProfile> {
    this._isLoading.set(true);
    const request: RegisterRequest = { email, password, displayName };

    return this.http.post<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/register`, request).pipe(
      map(response => response.data.user),
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw this.handleError(error, 'Registration failed');
      })
    );
  }

  /**
   * Convert guest account to registered account
   */
  convertGuest(email: string, password: string, displayName: string): Observable<UserProfile> {
    this._isLoading.set(true);
    const request: ConvertGuestRequest = { email, password, displayName };

    return this.http.post<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/convert`, request).pipe(
      map(response => response.data.user),
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw this.handleError(error, 'Account conversion failed');
      })
    );
  }

  /**
   * Login with Google OAuth
   * @param idToken - The Google ID token obtained from Google Sign-In
   */
  loginWithGoogle(idToken?: string): Observable<UserProfile> {
    this._isLoading.set(true);
    const body = idToken ? { idToken } : {};

    return this.http.post<ApiResponse<{ user: UserProfile }>>(`${this.baseUrl}/auth/google`, body).pipe(
      map(response => response.data.user),
      tap(user => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw this.handleError(error, 'Google sign-in failed');
      })
    );
  }

  /**
   * Logout - clears session and creates new guest session
   */
  logout(): Observable<void> {
    return this.http.post<ApiResponse<LogoutResponse>>(`${this.baseUrl}/auth/logout`, {}).pipe(
      map(() => undefined),
      tap(() => {
        this._currentUser.set(null);
        this._isInitialized.set(false);
      }),
      // Create new guest session after logout
      switchMap(() => this.createGuestSession().pipe(map(() => undefined))),
      catchError(error => {
        console.error('Logout failed:', error);
        // Still clear local state even if server request fails
        this._currentUser.set(null);
        this._isInitialized.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Check if email already exists
   * Returns suggested action: 'login' | 'convert' | 'register'
   */
  checkEmail(email: string): Observable<CheckEmailResponse> {
    const request: CheckEmailRequest = { email };

    return this.http
      .post<ApiResponse<CheckEmailResponse>>(`${this.baseUrl}/auth/check-email`, request)
      .pipe(
        map(response => response.data),
        catchError(error => {
          throw this.handleError(error, 'Email check failed');
        })
      );
  }

  /**
   * Handle HTTP errors and convert to AuthError
   */
  private handleError(error: unknown, defaultMessage: string): AuthError {
    if (error instanceof HttpErrorResponse) {
      const errorCode = error.error?.code as AuthErrorCode | undefined;
      const message = error.error?.message || defaultMessage;
      return new AuthError(message, errorCode || 'VALIDATION_ERROR', error.status, error.error?.details);
    }
    if (error instanceof AuthError) {
      return error;
    }
    return new AuthError(defaultMessage, 'VALIDATION_ERROR', 500);
  }

  /**
   * Update current user data (used by UserProfileService and AvatarService)
   * @param updates - Partial user data to merge with current user
   */
  updateUser(updates: Partial<UserProfile>): void {
    const currentUser = this._currentUser();
    if (currentUser) {
      this._currentUser.set({ ...currentUser, ...updates });
    }
  }
}