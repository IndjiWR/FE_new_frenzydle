import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError, delay } from 'rxjs';
import { MOCK_GAMES, MOCK_DAILY_STATUS } from '../mocks/game.mocks';
import { ApiResponse, GameWithStatus } from '../models';

// Environment will be injected at the app level
// For now, we'll use a default configuration
const DEFAULT_ENV = {
  production: false,
  useMocks: true,
  simulateError: false,
  apiBaseUrl: '/api',
};

/**
 * Gets the environment configuration
 * This is a placeholder that will be replaced by proper environment injection
 */
function getEnvironment(): typeof DEFAULT_ENV {
  try {
    // Try to access the environment from the global scope
    // This works when the app is running and environment is properly configured
    const env = (globalThis as Record<string, unknown>)['environment'];
    if (env && typeof env === 'object') {
      return env as typeof DEFAULT_ENV;
    }
    return DEFAULT_ENV;
  } catch {
    return DEFAULT_ENV;
  }
}

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
function createErrorResponse(message: string): HttpErrorResponse {
  return new HttpErrorResponse({
    error: { message, success: false },
    status: 500,
    statusText: 'Internal Server Error',
  });
}

/**
 * Mock HTTP Interceptor
 *
 * This interceptor intercepts all HTTP requests and returns mock data
 * when useMocks is enabled in the environment configuration.
 *
 * Supported endpoints:
 * - GET /api/games - Returns list of all games
 * - GET /api/games/:gameId/daily-status - Returns user's daily status for a game
 */
export const mockInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const env = getEnvironment();

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