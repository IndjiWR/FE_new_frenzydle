import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.isLoading()).toBe(false);
    expect(service.isInitialized()).toBe(false);
    expect(service.isGuest()).toBe(true);
    expect(service.displayName()).toBe('Guest');
    expect(service.userEmail()).toBeNull();
  });

  it('should create guest session', () => {
    const guestUser = {
      id: 'guest-1',
      displayName: 'Guest#1000',
      email: null,
      isGuest: true,
      avatarUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
    };

    service.createGuestSession().subscribe((user) => {
      expect(user).toEqual(guestUser);
    });

    const req = httpMock.expectOne('/api/auth/guest');
    expect(req.request.method).toBe('POST');
    req.flush({ data: { user: guestUser } });

    expect(service.currentUser()).toEqual(guestUser);
    expect(service.isGuest()).toBe(true);
  });

  it('should login with email and password', () => {
    const user = {
      id: 'user-1',
      displayName: 'TestUser',
      email: 'test@example.com',
      isGuest: false,
      avatarUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
    };

    service.login('test@example.com', 'password123').subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush({ data: { user } });

    expect(service.currentUser()).toEqual(user);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should register new user', () => {
    const user = {
      id: 'user-1',
      displayName: 'NewUser',
      email: 'new@example.com',
      isGuest: false,
      avatarUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
    };

    service.register('new@example.com', 'password123', 'NewUser').subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@example.com', password: 'password123', displayName: 'NewUser' });
    req.flush({ data: { user } });

    expect(service.currentUser()).toEqual(user);
  });

  it('should convert guest to registered account', () => {
    const user = {
      id: 'guest-1',
      displayName: 'ConvertedUser',
      email: 'converted@example.com',
      isGuest: false,
      avatarUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
    };

    service.convertGuest('converted@example.com', 'password123', 'ConvertedUser').subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne('/api/auth/convert');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'converted@example.com', password: 'password123', displayName: 'ConvertedUser' });
    req.flush({ data: { user } });

    expect(service.isGuest()).toBe(false);
  });

  it('should login with Google', () => {
    const user = {
      id: 'google-user-1',
      displayName: 'GoogleUser',
      email: 'google@example.com',
      isGuest: false,
      avatarUrl: 'google-avatar.png',
      createdAt: '2024-01-01T00:00:00Z',
    };

    service.loginWithGoogle().subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne('/api/auth/google');
    expect(req.request.method).toBe('POST');
    req.flush({ data: { user } });

    expect(service.currentUser()).toEqual(user);
  });

  it('should check email', () => {
    const response = { exists: true, suggestedAction: 'login' as const };

    service.checkEmail('existing@example.com').subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne('/api/auth/check-email');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'existing@example.com' });
    req.flush({ data: response });
  });

  it('should logout and create new guest session', () => {
    // First, set up a logged-in user
    (service as any)._currentUser.set({
      id: 'user-1',
      displayName: 'TestUser',
      email: 'test@example.com',
      isGuest: false,
      avatarUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
    });
    (service as any)._isInitialized.set(true);

    const guestUser = {
      id: 'guest-2',
      displayName: 'Guest#2000',
      email: null,
      isGuest: true,
      avatarUrl: null,
      createdAt: '2024-01-02T00:00:00Z',
    };

    service.logout().subscribe();

    let req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({ data: { success: true } });

    req = httpMock.expectOne('/api/auth/guest');
    expect(req.request.method).toBe('POST');
    req.flush({ data: { user: guestUser } });

    expect(service.currentUser()).toEqual(guestUser);
    expect(service.isGuest()).toBe(true);
  });

  it('should handle CSRF token fetch', () => {
    const token = 'test-csrf-token';

    // Access private method through casting
    (service as any).fetchCsrfToken().subscribe((result: string) => {
      expect(result).toBe(token);
    });

    const req = httpMock.expectOne('/api/auth/csrf');
    expect(req.request.method).toBe('GET');
    req.flush({ data: { token, expiresAt: '2024-12-31T23:59:59Z' } });

    expect(service.csrfToken()).toBe(token);
  });

  it('should handle getCurrentUser', () => {
    const user = {
      id: 'user-1',
      displayName: 'TestUser',
      email: 'test@example.com',
      isGuest: false,
      avatarUrl: 'avatar.png',
      createdAt: '2024-01-01T00:00:00Z',
    };

    (service as any).getCurrentUser().subscribe((result: any) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush({ data: { user } });
  });

  it('should return null when getCurrentUser fails', () => {
    (service as any).getCurrentUser().subscribe((result: any) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne('/api/auth/me');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });
});