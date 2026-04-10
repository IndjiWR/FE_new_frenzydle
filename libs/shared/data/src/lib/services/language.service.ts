import { Injectable, signal, effect, Inject, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../models/game.models';

/**
 * Language Service
 *
 * Manages application language with signal-based state.
 * Syncs with TranslateService and persists to localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // Signal-based state
  private readonly _language = signal<string>(DEFAULT_LANGUAGE);

  // Public readonly signals
  readonly language = this._language.asReadonly();

  // Available languages
  readonly languages = SUPPORTED_LANGUAGES;

  constructor(@Optional() private translate: TranslateService) {
    // Initialize language
    const initialLang = this.getInitialLanguage();
    this._language.set(initialLang);

    // Sync with translate service when it changes
    if (this.translate) {
      effect(() => {
        const lang = this._language();
        this.translate.use(lang);
        this.saveLanguage(lang);
      });
    }
  }

  /**
   * Get initial language from localStorage, translate service, or default
   */
  private getInitialLanguage(): string {
    // Check localStorage first
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && this.isValidLanguage(stored)) {
        return stored;
      }
    }

    // Check translate service if available
    if (this.translate) {
      if (this.translate.currentLang && this.isValidLanguage(this.translate.currentLang)) {
        return this.translate.currentLang;
      }
      if (this.translate.defaultLang && this.isValidLanguage(this.translate.defaultLang)) {
        return this.translate.defaultLang;
      }
    }

    return DEFAULT_LANGUAGE;
  }

  /**
   * Check if language code is valid
   */
  private isValidLanguage(code: string): boolean {
    return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
  }

  /**
   * Set language
   */
  setLanguage(langCode: string): void {
    if (this.isValidLanguage(langCode)) {
      this._language.set(langCode);
    }
  }

  /**
   * Save language to localStorage
   */
  private saveLanguage(lang: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }

  /**
   * Get language info by code
   */
  getLanguageInfo(code: string) {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0];
  }
}