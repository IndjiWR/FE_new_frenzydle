import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '@shared/feature';
import { signal } from '@angular/core';
import { UserProfile } from '../models/auth.models';

describe('Auth Guards', () => {
  let authService: jest.Mocked<AuthService>;
  let authModalService: jest.Mocked<AuthModalService>;
  let router: jest.Mocked<Router>;

  const mockUser: UserProfile = {
    id: 'user-1',
    displayName: 'TestUser',
    email: 'test@example.com',
    isGuest: false,
    avatarUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockGuest: UserProfile = {
    id: 'guest-1',
    displayName: 'Guest#1000',
    email: null,
    isGuest: true,
    avatarUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    authService = {
      isLoggedIn: signal(false),
      isGuest: signal(true),
      currentUser: signal(null),
    } as any;

    authModalService = {
      open: jest.fn(),
      close: jest.fn(),
      isOpen: signal(false),
      step: signal('method-selection'),
      redirectUrl: signal(null),
    } as any;

    router = {
      navigate: jest.fn(),
      url: '/',
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthModalService, useValue: authModalService },
        { provide: Router, useValue: router },
      ],
    });
  });

  describe('authGuard', () => {
    describe('logged in user', () => {
      it('should allow navigation when user is logged in', () => {
        (authService as any)._isLoggedIn = signal(true);
        (authService as any)._currentUser = signal(mockUser);
        authService.isLoggedIn = signal(true);
        authService.isGuest = signal(false);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: {} } as any, { url: '/protected' } as any)
        );

        expect(result).toBe(true);
        expect(authModalService.open).not.toHaveBeenCalled();
      });
    });

    describe('guest user', () => {
      it('should block navigation and open auth modal when guest not allowed', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: {} } as any, { url: '/protected' } as any)
        );

        expect(result).toBe(false);
        expect(authModalService.open).toHaveBeenCalledWith({ redirectUrl: '/protected' });
      });

      it('should allow navigation when guest and allowGuest is true', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: { allowGuest: true } } as any, { url: '/user' } as any)
        );

        expect(result).toBe(true);
        expect(authModalService.open).not.toHaveBeenCalled();
      });

      it('should allow navigation when guest and allowGuest route data is set', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const route = {
          data: { allowGuest: true },
        } as any;

        const result = TestBed.runInInjectionContext(() =>
          authGuard(route, { url: '/user/stats' } as any)
        );

        expect(result).toBe(true);
      });
    });

    describe('not logged in (no session)', () => {
      it('should block navigation and open auth modal', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: {} } as any, { url: '/profile' } as any)
        );

        expect(result).toBe(false);
        expect(authModalService.open).toHaveBeenCalled();
      });

      it('should pass redirect URL to auth modal', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        TestBed.runInInjectionContext(() =>
          authGuard({ data: {} } as any, { url: '/settings' } as any)
        );

        expect(authModalService.open).toHaveBeenCalledWith({ redirectUrl: '/settings' });
      });
    });

    describe('edge cases', () => {
      it('should handle undefined route data', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({} as any, { url: '/test' } as any)
        );

        expect(result).toBe(false);
        expect(authModalService.open).toHaveBeenCalled();
      });

      it('should handle null allowGuest value', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: { allowGuest: null } } as any, { url: '/test' } as any)
        );

        expect(result).toBe(false);
      });

      it('should handle false allowGuest value', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          authGuard({ data: { allowGuest: false } } as any, { url: '/test' } as any)
        );

        expect(result).toBe(false);
      });
    });
  });

  describe('guestGuard', () => {
    describe('not logged in', () => {
      it('should allow navigation when not logged in', () => {
        authService.isLoggedIn = signal(false);

        const result = TestBed.runInInjectionContext(() =>
          guestGuard({} as any, {} as any)
        );

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('logged in', () => {
      it('should redirect to home when logged in', () => {
        authService.isLoggedIn = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          guestGuard({} as any, {} as any)
        );

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    describe('edge cases', () => {
      it('should work for guests', () => {
        authService.isLoggedIn = signal(false);
        authService.isGuest = signal(true);

        const result = TestBed.runInInjectionContext(() =>
          guestGuard({} as any, {} as any)
        );

        expect(result).toBe(true);
      });
    });
  });
});