import { Injectable, signal, computed, effect } from '@angular/core';

/**
 * Theme type
 */
export type Theme = 'light' | 'dark';

/**
 * Theme Service
 *
 * Manages application theme (light/dark) with localStorage persistence.
 * Theme preference is saved and restored across sessions.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'frenzydle_theme';

  // Signal-based state
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  // Public readonly signals
  readonly theme = this._theme.asReadonly();

  // Computed signals for convenience
  readonly isDark = computed(() => this._theme() === 'dark');
  readonly isLight = computed(() => this._theme() === 'light');

  constructor() {
    // Apply theme on initialization and when it changes
    effect(() => {
      this.applyTheme(this._theme());
    });
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  private getInitialTheme(): Theme {
    // Check localStorage first
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return 'light';
  }

  /**
   * Toggle between light and dark theme
   */
  toggle(): void {
    this.setTheme(this._theme() === 'light' ? 'dark' : 'light');
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.saveTheme(theme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Also set data attribute for CSS selectors
    root.setAttribute('data-theme', theme);
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }
}