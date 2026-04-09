import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

/**
 * Mock HTTP Interceptor
 *
 * This interceptor intercepts all HTTP requests and returns mock data
 * when useMocks is enabled in the environment configuration.
 *
 * The interceptor simulates network latency (300-800ms) to provide
 * a realistic development experience.
 */
export const mockInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // TODO: Implement mock responses based on request URL
  // For now, pass through to the next handler
  // When implementing mock responses, check environment.useMocks flag

  // Simulated latency range: 300-800ms
  const simulatedLatency = Math.floor(Math.random() * 500) + 300;

  // Mock data responses will be implemented in future steps
  // Example structure:
  // if (request.url.includes('/api/games')) {
  //   return of(new HttpResponse({ body: mockGameData })).pipe(delay(simulatedLatency));
  // }

  return next(request);
};