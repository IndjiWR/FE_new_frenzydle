/**
 * Authentication Models
 *
 * User profiles and auth-related request/response types.
 * All auth state is stored in memory (signals only) - NO localStorage.
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
  timestamp?: string;
}

/**
 * User profile returned from auth endpoints
 */
export interface UserProfile {
  id: string;
  displayName: string;
  email: string | null;
  isGuest: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

/**
 * Response from GET /api/auth/me
 */
export interface AuthMeResponse {
  user: UserProfile;
}

/**
 * Request body for POST /api/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request body for POST /api/auth/register
 */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/**
 * Request body for POST /api/auth/convert
 * Used when converting a guest to a registered account
 */
export interface ConvertGuestRequest {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Request body for POST /api/auth/google
 */
export interface GoogleAuthRequest {
  mockToken?: string;
}

/**
 * Request body for POST /api/auth/check-email
 */
export interface CheckEmailRequest {
  email: string;
}

/**
 * Response from POST /api/auth/check-email
 */
export interface CheckEmailResponse {
  exists: boolean;
  suggestedAction: 'login' | 'convert' | 'register';
}

/**
 * Response from GET /api/auth/csrf
 */
export interface CsrfResponse {
  token: string;
  expiresAt: string;
}

/**
 * Generic auth response wrapper
 */
export interface AuthResponse {
  user: UserProfile;
  success: boolean;
  message?: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
}

/**
 * Auth state shape for the AuthService
 */
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  csrfToken: string | null;
}