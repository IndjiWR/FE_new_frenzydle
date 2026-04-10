import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@shared/data';
import { AuthModalService } from '@shared/feature';
import { signal } from '@angular/core';

describe('App', () => {
  let authServiceMock: jest.Mocked<AuthService>;
  let authModalServiceMock: jest.Mocked<AuthModalService>;

  beforeEach(() => {
    authServiceMock = {
      initialize: jest.fn().mockResolvedValue(undefined),
      isLoggedIn: signal(false),
      currentUser: signal(null),
      displayName: signal('Guest'),
      isLoading: signal(false),
      isInitialized: signal(true),
      isGuest: signal(true),
      userEmail: signal(null),
      csrfToken: signal(null),
      createGuestSession: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      convertGuest: jest.fn(),
      loginWithGoogle: jest.fn(),
      logout: jest.fn(),
      checkEmail: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authModalServiceMock = {
      isOpen: signal(false),
      step: signal('method-selection'),
      redirectUrl: signal(null),
      open: jest.fn(),
      close: jest.fn(),
      handleLoginSuccess: jest.fn(),
    } as unknown as jest.Mocked<AuthModalService>;

    TestBed.configureTestingModule({
      imports: [App, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthModalService, useValue: authModalServiceMock },
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title FrenzyDle', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toBe('FrenzyDle');
  });

  it('should render nav-bar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have nav items', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.navItems.length).toBe(2);
    expect(app.navItems[0].label).toBe('nav.home');
    expect(app.navItems[0].path).toBe('/');
  });

  it('should have default user state from auth service', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoggedIn()).toBe(false);
    expect(app.isGuest()).toBe(true);
    expect(app.userName()).toBe('Guest');
    expect(app.userAvatar()).toBe('');
  });

  it('should call authModalService.open on login click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.onLoginClick();
    expect(authModalServiceMock.open).toHaveBeenCalled();
  });

  it('should call authService.logout on logout click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    authServiceMock.logout.mockReturnValue({
      subscribe: (fn: Function) => fn(),
    } as any);
    app.onLogoutClick();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should have settings click handler', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.onSettingsClick).toBeDefined();
  });
});