import {
  ApplicationConfig, importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { appRoutes } from './app.routes';
import { mockInterceptor } from '@shared/data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([mockInterceptor])),
    // Configure ngx-translate with HTTP loader
    importProvidersFrom(TranslateModule.forRoot({
      fallbackLang: getStoredLanguage(),
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }))
  ],
};

/**
 * Gets the stored language preference from localStorage
 * Falls back to browser language or 'en' if not set
 */
function getStoredLanguage(): string {
  if (typeof localStorage === 'undefined') {
    return getBrowserLanguage();
  }

  const stored = localStorage.getItem('frenzydle_language');
  if (stored && ['en', 'it', 'fr', 'es', 'pt'].includes(stored)) {
    return stored;
  }

  return getBrowserLanguage();
}

/**
 * Gets the browser's preferred language
 * Maps browser language codes to supported languages
 */
function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language?.split('-')[0] || 'en';
  const supportedLanguages = ['en', 'it', 'fr', 'es', 'pt'];

  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
}