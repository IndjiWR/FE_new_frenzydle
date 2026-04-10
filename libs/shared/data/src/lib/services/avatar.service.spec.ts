import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvatarService } from './avatar.service';
import { AuthService } from './auth.service';
import { DEFAULT_AVATAR, MOCK_AVATAR_OPTIONS } from '../mocks/avatar.mocks';
import { signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../models';

describe('AvatarService', () => {
  let service: AvatarService;
  let httpMock: HttpTestingController;

  const mockUser: UserProfile = {
    id: 'user-001',
    displayName: 'Test User',
    email: 'test@example.com',
    isGuest: false,
    avatarUrl: null,
    avatarData: {
      skinTone: 'skin-light',
      hairStyle: 'hair-short-1',
      hairColor: 'hair-color-brown',
      eyeStyle: 'eyes-round',
      expression: 'expr-smile',
      glasses: null,
      hat: null,
      bgColor: 'bg-lavender',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  // Create a signal-based mock for currentUser
  const mockCurrentUser: WritableSignal<UserProfile | null> = signal(mockUser);

  beforeEach(() => {
    const authServiceMock = {
      currentUser: mockCurrentUser.asReadonly(),
      updateUser: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AvatarService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(AvatarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadOptions', () => {
    it('should load avatar options from API', async () => {
      const mockResponse = {
        options: MOCK_AVATAR_OPTIONS.slice(0, 10),
        unlockedIds: ['hair-curly', 'hat-crown'],
      };

      const promise = service.loadOptions();
      const req = httpMock.expectOne('/api/avatar/options');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await promise;

      expect(service.options().length).toBe(10);
      expect(service.isOptionUnlocked('hair-curly')).toBe(true);
      expect(service.isOptionUnlocked('skin-light')).toBe(true);
    });

    it('should set loading state during API call', async () => {
      expect(service.isLoading()).toBe(false);

      const promise = service.loadOptions();
      expect(service.isLoading()).toBe(true);

      const req = httpMock.expectOne('/api/avatar/options');
      req.flush({ options: [], unlockedIds: [] });

      await promise;
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('initEditor', () => {
    it('should initialize editor with current user avatar', () => {
      service.initEditor();
      const state = service.editorState();

      expect(state).toBeTruthy();
      expect(state?.skinTone).toBe('skin-light');
      expect(state?.hairStyle).toBe('hair-short-1');
    });
  });

  describe('setEditorOption', () => {
    beforeEach(() => {
      service.initEditor();
    });

    it('should update a single option', () => {
      service.setEditorOption('skinTone', 'skin-dark');
      expect(service.editorState()?.skinTone).toBe('skin-dark');
    });

    it('should set glasses to null', () => {
      service.setEditorOption('glasses', 'glasses-round');
      expect(service.editorState()?.glasses).toBe('glasses-round');

      service.setEditorOption('glasses', null);
      expect(service.editorState()?.glasses).toBeNull();
    });

    it('should set hat to null', () => {
      service.setEditorOption('hat', 'hat-cap');
      expect(service.editorState()?.hat).toBe('hat-cap');

      service.setEditorOption('hat', null);
      expect(service.editorState()?.hat).toBeNull();
    });
  });

  describe('resetEditor', () => {
    it('should reset editor to current saved avatar', () => {
      service.initEditor();
      service.setEditorOption('skinTone', 'skin-dark');
      service.setEditorOption('hairStyle', 'hair-long');

      service.resetEditor();

      expect(service.editorState()?.skinTone).toBe('skin-light');
      expect(service.editorState()?.hairStyle).toBe('hair-short-1');
    });
  });

  describe('resetToDefault', () => {
    it('should reset editor to default avatar', () => {
      service.initEditor();
      service.setEditorOption('skinTone', 'skin-dark');

      service.resetToDefault();

      expect(service.editorState()).toEqual(DEFAULT_AVATAR);
    });
  });

  describe('hasUnsavedChanges', () => {
    it('should return false when no changes', () => {
      service.initEditor();
      expect(service.hasUnsavedChanges()).toBe(false);
    });

    it('should return true when there are changes', () => {
      service.initEditor();
      service.setEditorOption('skinTone', 'skin-dark');
      expect(service.hasUnsavedChanges()).toBe(true);
    });

    it('should return false when changes are reverted', () => {
      service.initEditor();
      service.setEditorOption('skinTone', 'skin-dark');
      service.setEditorOption('skinTone', 'skin-light');
      expect(service.hasUnsavedChanges()).toBe(false);
    });
  });

  describe('randomize', () => {
    beforeEach(() => {
      service.initEditor();
    });

    it('should change avatar options', () => {
      service.randomize();
      const state = service.editorState();
      expect(state).toBeTruthy();
    });

    it('should create valid avatar data structure', () => {
      service.randomize();
      const state = service.editorState();

      expect(state).toBeTruthy();
      expect(state?.skinTone).toBeTruthy();
      expect(state?.hairStyle).toBeTruthy();
      expect(state?.hairColor).toBeTruthy();
      expect(state?.eyeStyle).toBeTruthy();
      expect(state?.expression).toBeTruthy();
      expect(state?.bgColor).toBeTruthy();
    });
  });

  describe('saveAvatar', () => {
    beforeEach(() => {
      service.initEditor();
    });

    it('should save avatar and update auth service', async () => {
      service.setEditorOption('skinTone', 'skin-dark');

      const promise = service.saveAvatar();

      const req = httpMock.expectOne('/api/user/avatar');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.avatarData.skinTone).toBe('skin-dark');

      req.flush({
        user: {
          avatarData: {
            skinTone: 'skin-dark',
            hairStyle: 'hair-short-1',
            hairColor: 'hair-color-brown',
            eyeStyle: 'eyes-round',
            expression: 'expr-smile',
            glasses: null,
            hat: null,
            bgColor: 'bg-lavender',
          },
        },
      });

      await promise;
      const authService = TestBed.inject(AuthService);
      expect(authService.updateUser).toHaveBeenCalled();
    });

    it('should set saving state during API call', async () => {
      expect(service.isSaving()).toBe(false);

      const promise = service.saveAvatar();
      expect(service.isSaving()).toBe(true);

      const req = httpMock.expectOne('/api/user/avatar');
      req.flush({ user: { avatarData: DEFAULT_AVATAR } });

      await promise;
      expect(service.isSaving()).toBe(false);
    });
  });

  describe('isOptionUnlocked', () => {
    it('should return true for default options', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({ options: MOCK_AVATAR_OPTIONS, unlockedIds: [] });
      await promise;

      expect(service.isOptionUnlocked('skin-light')).toBe(true);
      expect(service.isOptionUnlocked('hair-short-1')).toBe(true);
    });

    it('should return true for unlocked options', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({
        options: MOCK_AVATAR_OPTIONS,
        unlockedIds: ['hair-curly', 'glasses-aviator'],
      });
      await promise;

      expect(service.isOptionUnlocked('hair-curly')).toBe(true);
      expect(service.isOptionUnlocked('glasses-aviator')).toBe(true);
    });

    it('should return false for locked options', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({ options: MOCK_AVATAR_OPTIONS, unlockedIds: [] });
      await promise;

      expect(service.isOptionUnlocked('hair-curly')).toBe(false);
      expect(service.isOptionUnlocked('hat-crown')).toBe(false);
    });
  });

  describe('getUnlockRequirement', () => {
    it('should return unlock achievement for locked options', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({ options: MOCK_AVATAR_OPTIONS, unlockedIds: [] });
      await promise;

      expect(service.getUnlockRequirement('hair-curly')).toBe('ten-games');
      expect(service.getUnlockRequirement('hat-crown')).toBe('avatar-hat');
    });

    it('should return undefined for default options', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({ options: MOCK_AVATAR_OPTIONS, unlockedIds: [] });
      await promise;

      expect(service.getUnlockRequirement('skin-light')).toBeUndefined();
    });
  });

  describe('optionsByCategory', () => {
    it('should group options by category', async () => {
      const promise = service.loadOptions();
      httpMock.expectOne('/api/avatar/options').flush({ options: MOCK_AVATAR_OPTIONS, unlockedIds: [] });
      await promise;

      const grouped = service.optionsByCategory();

      expect(grouped.skinTone.length).toBeGreaterThan(0);
      expect(grouped.hairStyle.length).toBeGreaterThan(0);
      expect(grouped.hairColor.length).toBeGreaterThan(0);
      expect(grouped.eyeStyle.length).toBeGreaterThan(0);
      expect(grouped.expression.length).toBeGreaterThan(0);
      expect(grouped.glasses.length).toBeGreaterThan(0);
      expect(grouped.hat.length).toBeGreaterThan(0);
      expect(grouped.bgColor.length).toBeGreaterThan(0);
    });
  });

  describe('currentAvatar', () => {
    it('should return user avatar from auth service', () => {
      const avatar = service.currentAvatar();
      expect(avatar).toBeTruthy();
      expect(avatar?.skinTone).toBe('skin-light');
    });
  });
});