import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../models/game.models';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    translateService = {
      use: jest.fn(),
      currentLang: 'en',
      defaultLang: 'en',
    } as any;

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateService },
      ],
    });

    // Clear localStorage before each test
    localStorage.clear();
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have languages available', () => {
      expect(service.languages).toBe(SUPPORTED_LANGUAGES);
      expect(service.languages.length).toBe(5);
    });

    it('should initialize with default language when no stored preference', () => {
      expect(service.language()).toBe(DEFAULT_LANGUAGE);
    });

    it('should initialize from localStorage when valid language stored', () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'it');

      // Create new instance to test initialization
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          LanguageService,
          { provide: TranslateService, useValue: translateService },
        ],
      });
      const newService = TestBed.inject(LanguageService);

      expect(newService.language()).toBe('it');
    });

    it('should initialize from TranslateService currentLang when no stored preference', () => {
      translateService.currentLang = 'fr';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          LanguageService,
          { provide: TranslateService, useValue: translateService },
        ],
      });
      const newService = TestBed.inject(LanguageService);

      expect(newService.language()).toBe('fr');
    });

    it('should fall back to default language for invalid stored language', () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'invalid');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          LanguageService,
          { provide: TranslateService, useValue: translateService },
        ],
      });
      const newService = TestBed.inject(LanguageService);

      expect(newService.language()).toBe(DEFAULT_LANGUAGE);
    });

    it('should work without TranslateService', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [LanguageService],
      });

      const newService = TestBed.inject(LanguageService);
      expect(newService.language()).toBe(DEFAULT_LANGUAGE);
    });
  });

  describe('setLanguage', () => {
    it('should update language signal', () => {
      service.setLanguage('it');
      expect(service.language()).toBe('it');
    });

    it('should not update language for invalid language code', () => {
      const initialLang = service.language();
      service.setLanguage('invalid');
      expect(service.language()).toBe(initialLang);
    });

    it('should accept all supported language codes', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        service.setLanguage(lang.code);
        expect(service.language()).toBe(lang.code);
      });
    });

    it('should reject unsupported language codes', () => {
      const unsupportedCodes = ['de', 'jp', 'cn', 'ru', 'ar'];
      unsupportedCodes.forEach(code => {
        const currentLang = service.language();
        service.setLanguage(code);
        // Language should remain unchanged
        expect(service.language()).toBe(currentLang);
      });
    });
  });

  describe('getLanguageInfo', () => {
    it('should return language info for valid code', () => {
      const info = service.getLanguageInfo('en');
      expect(info.code).toBe('en');
      expect(info.name).toBe('English');
    });

    it('should return first language for invalid code', () => {
      const info = service.getLanguageInfo('invalid');
      expect(info).toBe(SUPPORTED_LANGUAGES[0]);
    });

    it('should return correct info for each supported language', () => {
      const codes = ['en', 'it', 'fr', 'es', 'pt'];
      codes.forEach(code => {
        const info = service.getLanguageInfo(code);
        expect(info.code).toBe(code);
      });
    });
  });
});