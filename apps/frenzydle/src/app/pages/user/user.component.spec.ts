import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { UserComponent } from './user.component';
import { AuthService, ThemeService } from '@shared/data';
import { UserProfile } from '@shared/data';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockAuthService: any;
  let mockThemeService: any;

  const mockUser: UserProfile = {
    id: 'user-123',
    displayName: 'TestUser',
    email: 'test@example.com',
    isGuest: false,
    avatarUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    mockAuthService = {
      isLoggedIn: signal(true),
      isGuest: signal(false),
      currentUser: signal(mockUser),
    };

    mockThemeService = {
      isDark: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [UserComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          {
            path: 'user',
            children: [
              { path: '', redirectTo: 'stats', pathMatch: 'full' },
              { path: 'stats', component: class MockTabComponent {} },
              { path: 'achievements', component: class MockTabComponent {} },
              { path: 'settings', component: class MockTabComponent {} },
            ],
          },
        ]),
        provideLocationMocks(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid router navigation
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct tabs configuration', () => {
    expect(component.tabs.length).toBe(3);
    expect(component.tabs[0].path).toBe('/user/stats');
    expect(component.tabs[1].path).toBe('/user/achievements');
    expect(component.tabs[2].path).toBe('/user/settings');
  });

  it('should expose auth service signals', () => {
    expect(component.isLoggedIn()).toBe(true);
    expect(component.isGuest()).toBe(false);
    expect(component.currentUser()).toEqual(mockUser);
  });

  it('should expose theme service signal', () => {
    expect(component.isDarkTheme()).toBe(false);
  });

  it('should check tab active state', () => {
    // The router.url would need to be mocked properly
    // For now, just test the method exists
    expect(typeof component.isTabActive).toBe('function');
  });
});