import { csrfInterceptor } from './csrf.interceptor';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('csrfInterceptor', () => {
  let authService: jest.Mocked<AuthService>;
  let mockHandler: jest.MockedFunction<HttpHandlerFn>;

  beforeEach(() => {
    authService = {
      csrfToken: signal(null),
    } as any;

    mockHandler = jest.fn();

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
  });

  const createRequest = (method: string, url: string) => {
    return new HttpRequest(method, url, {}, { withCredentials: true });
  };

  describe('mutating methods', () => {
    it('should add CSRF token header for POST requests', () => {
      (authService as any)._csrfToken = signal('test-csrf-token');
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('POST', '/api/auth/login');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      expect(mockHandler).toHaveBeenCalled();
      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
    });

    it('should add CSRF token header for PUT requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('PUT', '/api/user/profile');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
    });

    it('should add CSRF token header for DELETE requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('DELETE', '/api/user/account');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
    });

    it('should add CSRF token header for PATCH requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('PATCH', '/api/user/settings');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
    });
  });

  describe('non-mutating methods', () => {
    it('should NOT add CSRF token header for GET requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('GET', '/api/auth/me');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBeNull();
    });

    it('should NOT add CSRF token header for HEAD requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('HEAD', '/api/auth/check');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBeNull();
    });

    it('should NOT add CSRF token header for OPTIONS requests', () => {
      authService.csrfToken = signal('test-csrf-token');

      const request = createRequest('OPTIONS', '/api/auth/preflight');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBeNull();
    });
  });

  describe('missing CSRF token', () => {
    it('should proceed without CSRF token if not available', () => {
      authService.csrfToken = signal(null);

      const request = createRequest('POST', '/api/auth/login');
      mockHandler.mockReturnValue('response' as any);

      TestBed.runInInjectionContext(() => {
        csrfInterceptor(request, mockHandler);
      });

      // Request should still be sent
      expect(mockHandler).toHaveBeenCalled();
      const clonedRequest = mockHandler.mock.calls[0][0];
      expect(clonedRequest.headers.get('X-CSRF-Token')).toBeNull();
    });
  });
});