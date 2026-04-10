import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { SettingsTabComponent } from './settings-tab.component';
import { AuthService, ThemeService, UserProfileService } from '@shared/data';
import { AuthModalService } from '@shared/feature';
import { UserProfile } from '@shared/data';

describe('SettingsTabComponent', () => {
  let component: SettingsTabComponent;
  let fixture: ComponentFixture<SettingsTabComponent>;
  let mockAuthService: any;
  let mockThemeService: any;
  let mockUserProfileService: any;
  let mockAuthModalService: any;
  let translateService: TranslateService;
  let mockRouter: any;

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
      isGuest: signal(false),
      currentUser: signal(mockUser),
      isLoggedIn: signal(true),
    };

    mockThemeService = {
      isDark: signal(false),
      toggle: jest.fn(),
    };

    mockUserProfileService = {
      updateDisplayName: jest.fn().mockResolvedValue(undefined),
      changePassword: jest.fn().mockResolvedValue(undefined),
      deleteAccount: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
    };

    mockAuthModalService = {
      open: jest.fn(),
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsTabComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: UserProfileService, useValue: mockUserProfileService },
        { provide: AuthModalService, useValue: mockAuthModalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    // Set up translations
    translateService.setTranslation('en', {
      'user.settings.nameError': 'Name must be 2-24 characters',
      'user.settings.nameSaved': 'Name saved',
      'common.error': 'Error',
    });
    translateService.setDefaultLang('en');
    translateService.use('en');

    fixture = TestBed.createComponent(SettingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start editing name', () => {
    component.startEditName();
    expect(component.isEditingName()).toBe(true);
    expect(component.editNameValue()).toBe('TestUser');
  });

  it('should cancel editing name', () => {
    component.startEditName();
    component.cancelEditName();
    expect(component.isEditingName()).toBe(false);
    expect(component.editNameValue()).toBe('');
  });

  it('should not save name if too short', async () => {
    component.editNameValue.set('a');
    await component.saveName();

    expect(mockUserProfileService.updateDisplayName).not.toHaveBeenCalled();
  });

  it('should save name with valid value', async () => {
    component.editNameValue.set('NewName');
    await component.saveName();

    expect(mockUserProfileService.updateDisplayName).toHaveBeenCalledWith('NewName');
    expect(component.isEditingName()).toBe(false);
  });

  it('should not change password if too short', async () => {
    component.newPassword.set('short');
    component.confirmPassword.set('short');
    await component.changePassword();

    expect(component.passwordError()).toBe('user.settings.passwordTooShort');
    expect(mockUserProfileService.changePassword).not.toHaveBeenCalled();
  });

  it('should not change password if mismatch', async () => {
    component.newPassword.set('password123');
    component.confirmPassword.set('different');
    await component.changePassword();

    expect(component.passwordError()).toBe('user.settings.passwordMismatch');
    expect(mockUserProfileService.changePassword).not.toHaveBeenCalled();
  });

  it('should change password with valid values', async () => {
    component.currentPassword.set('oldpass');
    component.newPassword.set('newpassword123');
    component.confirmPassword.set('newpassword123');
    await component.changePassword();

    expect(mockUserProfileService.changePassword).toHaveBeenCalledWith('oldpass', 'newpassword123');
    expect(component.showPasswordForm()).toBe(false);
  });

  it('should change language', () => {
    const useSpy = jest.spyOn(translateService, 'use');
    component.onLanguageChange('it');
    expect(component.selectedLanguage()).toBe('it');
    expect(useSpy).toHaveBeenCalledWith('it');
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(mockThemeService.toggle).toHaveBeenCalled();
  });

  it('should open delete modal', () => {
    component.openDeleteModal();
    expect(component.showDeleteModal()).toBe(true);
    expect(component.deleteConfirmText()).toBe('');
  });

  it('should close delete modal', () => {
    component.openDeleteModal();
    component.closeDeleteModal();
    expect(component.showDeleteModal()).toBe(false);
  });

  it('should check canDelete correctly', () => {
    expect(component.canDelete()).toBe(false);
    component.deleteConfirmText.set('DELETE');
    expect(component.canDelete()).toBe(true);
    component.deleteConfirmText.set('delete');
    expect(component.canDelete()).toBe(false);
  });

  it('should not delete account if canDelete is false', async () => {
    component.deleteConfirmText.set('wrong');
    await component.deleteAccount();

    expect(mockUserProfileService.deleteAccount).not.toHaveBeenCalled();
  });

  it('should delete account', async () => {
    component.deleteConfirmText.set('DELETE');
    await component.deleteAccount();

    expect(mockUserProfileService.deleteAccount).toHaveBeenCalled();
  });

  it('should logout', async () => {
    await component.logout();

    expect(mockUserProfileService.logout).toHaveBeenCalled();
  });

  it('should have available languages', () => {
    expect(component.languages.length).toBe(5);
    expect(component.languages[0].code).toBe('en');
    expect(component.languages[1].code).toBe('it');
  });
});