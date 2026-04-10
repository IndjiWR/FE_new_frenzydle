import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError, delay } from 'rxjs';
import { inject } from '@angular/core';
import { MOCK_GAMES, MOCK_DAILY_STATUS } from '../mocks/game.mocks';
import { ApiResponse, GameWithStatus } from '../models';
import { UserProfile } from '../models/auth.models';
import { ENVIRONMENT, AuthEnvironment } from '../services/auth.service';

/**
 * In-memory session state for mock auth
 * This simulates server-side session storage
 */
let mockCurrentUser: UserProfile | null = null;
let mockGuestCounter = 1000;

/**
 * Simulates network latency (400-700ms) for realistic development experience
 */
function getRandomLatency(): number {
  return Math.floor(Math.random() * 300) + 400;
}

/**
 * Creates a standardized API response
 */
function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates an error response
 */
function createErrorResponse(message: string, status: number = 500): HttpErrorResponse {
  return new HttpErrorResponse({
    error: { message, success: false },
    status,
    statusText: status === 401 ? 'Unauthorized' : 'Internal Server Error',
  });
}

/**
 * Generates a random 4-digit number for guest display names
 */
function generateGuestSuffix(): string {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

/**
 * Generates a UUID-like string
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mock HTTP Interceptor
 *
 * This interceptor intercepts all HTTP requests and returns mock data
 * when useMocks is enabled in the environment configuration.
 *
 * Set useMocks: false in environment.ts to use real backend.
 *
 * Supported endpoints:
 * AUTH:
 * - GET /api/auth/csrf - Returns CSRF token
 * - GET /api/auth/me - Returns current user or 401
 * - POST /api/auth/guest - Creates guest session
 * - POST /api/auth/login - Login with credentials
 * - POST /api/auth/register - Register new account
 * - POST /api/auth/convert - Convert guest to registered
 * - POST /api/auth/google - Google OAuth login
 * - POST /api/auth/logout - Logout
 * - POST /api/auth/check-email - Check if email exists
 *
 * GAMES:
 * - GET /api/games - Returns list of all games
 * - GET /api/games/:gameId - Returns single game
 * - GET /api/games/:gameId/daily-status - Returns user's daily status for a game
 */
export const mockInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Get environment from DI
  let env: AuthEnvironment;
  try {
    env = inject(ENVIRONMENT);
  } catch {
    // Fallback if ENVIRONMENT is not provided (e.g., in tests)
    env = {
      production: false,
      useMocks: true,
      simulateError: false,
      apiBaseUrl: '/api',
    };
  }

  // Only intercept if mocks are enabled
  if (!env.useMocks) {
    return next(request);
  }

  const latency = getRandomLatency();

  // Simulate error if flag is set
  if (env.simulateError) {
    return throwError(() => createErrorResponse('Simulated error for testing'))
      .pipe(delay(latency));
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================

  // Handle GET /api/auth/csrf
  if (request.method === 'GET' && request.url === '/api/auth/csrf') {
    const response = createApiResponse({
      token: 'mock-csrf-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    });
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle GET /api/auth/me
  if (request.method === 'GET' && request.url === '/api/auth/me') {
    if (mockCurrentUser) {
      const response = createApiResponse({ user: mockCurrentUser });
      return of(new HttpResponse({ body: response, status: 200 }))
        .pipe(delay(latency));
    }
    // No session - return 401
    return throwError(() => createErrorResponse('No active session', 401))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/guest
  if (request.method === 'POST' && request.url === '/api/auth/guest') {
    const guestUser: UserProfile = {
      id: generateId(),
      displayName: `Guest#${generateGuestSuffix()}`,
      email: null,
      isGuest: true,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };
    mockCurrentUser = guestUser;
    const response = createApiResponse({ user: guestUser });
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/login
  if (request.method === 'POST' && request.url === '/api/auth/login') {
    const body = request.body as { email?: string; password?: string };
    // Mock: accept any password for test@frenzydle.com
    if (body?.email === 'test@frenzydle.com' && body?.password && body.password.length >= 8) {
      const user: UserProfile = {
        id: 'user-001',
        displayName: 'Tester',
        email: 'test@frenzydle.com',
        isGuest: false,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };
      mockCurrentUser = user;
      const response = createApiResponse({ user });
      return of(new HttpResponse({ body: response, status: 200 }))
        .pipe(delay(latency));
    }
    return throwError(() => createErrorResponse('Invalid credentials', 401))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/register
  if (request.method === 'POST' && request.url === '/api/auth/register') {
    const body = request.body as { email?: string; password?: string; displayName?: string };
    if (body?.email && body?.password && body?.displayName) {
      const user: UserProfile = {
        id: generateId(),
        displayName: body.displayName,
        email: body.email,
        isGuest: false,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };
      mockCurrentUser = user;
      const response = createApiResponse({ user });
      return of(new HttpResponse({ body: response, status: 200 }))
        .pipe(delay(latency));
    }
    return throwError(() => createErrorResponse('Missing required fields', 400))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/convert
  if (request.method === 'POST' && request.url === '/api/auth/convert') {
    const body = request.body as { email?: string; password?: string; displayName?: string };
    if (body?.email && body?.password) {
      // Preserve the guest UUID but update other fields
      const existingUser = mockCurrentUser;
      const user: UserProfile = {
        id: existingUser?.id || generateId(),
        displayName: body.displayName || body.email.split('@')[0],
        email: body.email,
        isGuest: false,
        avatarUrl: null,
        createdAt: existingUser?.createdAt || new Date().toISOString(),
      };
      mockCurrentUser = user;
      const response = createApiResponse({ user });
      return of(new HttpResponse({ body: response, status: 200 }))
        .pipe(delay(latency));
    }
    return throwError(() => createErrorResponse('Missing required fields', 400))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/google
  if (request.method === 'POST' && request.url === '/api/auth/google') {
    // Mock Google login - always succeed
    const user: UserProfile = {
      id: 'google-001',
      displayName: 'Mario Rossi',
      email: 'mario.rossi@gmail.com',
      isGuest: false,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };
    mockCurrentUser = user;
    const response = createApiResponse({ user });
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/logout
  if (request.method === 'POST' && request.url === '/api/auth/logout') {
    mockCurrentUser = null;
    const response = createApiResponse({ success: true });
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle POST /api/auth/check-email
  if (request.method === 'POST' && request.url === '/api/auth/check-email') {
    const body = request.body as { email?: string };
    const email = body?.email || '';

    // Mock: test@frenzydle.com exists
    const exists = email === 'test@frenzydle.com';

    // Determine suggested action based on current user state
    let suggestedAction: 'login' | 'convert' | 'register';
    if (exists) {
      suggestedAction = 'login';
    } else if (mockCurrentUser?.isGuest) {
      suggestedAction = 'convert';
    } else {
      suggestedAction = 'register';
    }

    const response = createApiResponse({ exists, suggestedAction });
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // ============================================
  // GAME ENDPOINTS
  // ============================================

  // Handle GET /api/games
  if (request.method === 'GET' && request.url === '/api/games') {
    const response = createApiResponse(MOCK_GAMES);
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle GET /api/games/:gameId/daily-status
  const dailyStatusMatch = request.url.match(/^\/api\/games\/([^/]+)\/daily-status$/);
  if (request.method === 'GET' && dailyStatusMatch) {
    const gameId = dailyStatusMatch[1];
    const status = MOCK_DAILY_STATUS[gameId] || MOCK_DAILY_STATUS['dragonball'];
    const response = {
      data: {
        gameId,
        status: {
          streakCount: status.streakCount,
          attemptsUsed: status.attemptsUsed,
          maxAttempts: status.maxAttempts,
          isCompletedToday: status.isCompletedToday,
          nextResetAt: getNextMidnightUTC(),
        },
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
    return of(new HttpResponse({ body: response, status: 200 }))
      .pipe(delay(latency));
  }

  // Handle GET /api/games/:gameId
  const gameMatch = request.url.match(/^\/api\/games\/([^/]+)$/);
  if (request.method === 'GET' && gameMatch) {
    const gameId = gameMatch[1];
    const game = MOCK_GAMES.find(g => g.id === gameId);
    if (game) {
      const response = createApiResponse(game);
      return of(new HttpResponse({ body: response, status: 200 }))
        .pipe(delay(latency));
    }
    return throwError(() => createErrorResponse(`Game ${gameId} not found`))
      .pipe(delay(latency));
  }

  // Pass through unhandled requests
  return next(request);
};

/**
 * Helper function to get next midnight UTC
 */
function getNextMidnightUTC(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}