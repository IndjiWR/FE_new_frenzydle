import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, ThemeService, UserProfileService, LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE } from '@shared/data';
import { AuthModalService } from '@shared/feature';

/**
 * Settings Tab Component
 *
 * Displays user settings with account, preferences, and danger zone sections.
 * Fully functional for both guests and logged-in users.
 */
@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.css'],
})
export class SettingsTabComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly userProfileService = inject(UserProfileService);
  protected readonly authModalService = inject(AuthModalService);
  protected readonly translateService = inject(TranslateService);
  protected readonly router = inject(Router);

  // User info
  isGuest = this.authService.isGuest;
  currentUser = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn;

  // Display name editing
  isEditingName = signal(false);
  editNameValue = signal('');

  // Password change
  showPasswordForm = signal(false);
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  passwordError = signal('');

  // Delete account
  showDeleteModal = signal(false);
  deleteConfirmText = signal('');

  // Toast
  showToast = signal(false);
  toastMessage = signal('');

  // Available languages
  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  // Selected language - initialize from translate service or localStorage
  selectedLanguage = signal(this.getInitialLanguage());

  // Is dark theme
  isDarkTheme = this.themeService.isDark;

  constructor() {
    // Subscribe to language changes from other components
    this.translateService.onLangChange.subscribe((event) => {
      this.selectedLanguage.set(event.lang);
    });
  }

  /**
   * Get initial language from translate service or localStorage
   */
  private getInitialLanguage(): string {
    // First try translate service currentLang
    if (this.translateService.currentLang) {
      return this.translateService.currentLang;
    }
    // Then try localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        return stored;
      }
    }
    // Then try defaultLang
    if (this.translateService.defaultLang) {
      return this.translateService.defaultLang;
    }
    // Finally fallback to DEFAULT_LANGUAGE
    return DEFAULT_LANGUAGE;
  }

  /**
   * Start editing display name
   */
  startEditName(): void {
    this.editNameValue.set(this.currentUser()?.displayName ?? '');
    this.isEditingName.set(true);
  }

  /**
   * Cancel editing display name
   */
  cancelEditName(): void {
    this.isEditingName.set(false);
    this.editNameValue.set('');
  }

  /**
   * Save display name
   */
  async saveName(): Promise<void> {
    const newName = this.editNameValue().trim();
    if (!newName || newName.length < 2 || newName.length > 24) {
      this.showToastMessage('user.settings.nameError');
      return;
    }

    try {
      await this.userProfileService.updateDisplayName(newName);
      this.isEditingName.set(false);
      this.showToastMessage('user.settings.nameSaved');
    } catch (error) {
      this.showToastMessage('common.error');
    }
  }

  /**
   * Change password
   */
  async changePassword(): Promise<void> {
    if (this.newPassword().length < 8) {
      this.passwordError.set('user.settings.passwordTooShort');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('user.settings.passwordMismatch');
      return;
    }

    try {
      await this.userProfileService.changePassword(
        this.currentPassword(),
        this.newPassword()
      );
      this.showPasswordForm.set(false);
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
      this.passwordError.set('');
      this.showToastMessage('user.settings.passwordSaved');
    } catch (error) {
      this.passwordError.set('user.settings.passwordError');
    }
  }

  /**
   * Change language
   */
  onLanguageChange(langCode: string): void {
    this.selectedLanguage.set(langCode);
    this.translateService.use(langCode);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggle();
  }

  /**
   * Open delete modal
   */
  openDeleteModal(): void {
    this.showDeleteModal.set(true);
    this.deleteConfirmText.set('');
  }

  /**
   * Close delete modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deleteConfirmText.set('');
  }

  /**
   * Check if delete is allowed
   */
  canDelete(): boolean {
    return this.deleteConfirmText() === 'DELETE';
  }

  /**
   * Delete account
   */
  async deleteAccount(): Promise<void> {
    if (!this.canDelete()) return;

    try {
      await this.userProfileService.deleteAccount();
      this.showToastMessage('user.settings.accountDeleted');
      // Wait a moment then redirect
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 1500);
    } catch (error) {
      this.showToastMessage('common.error');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.userProfileService.logout();
      this.showToastMessage('user.settings.goodbye');
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 1500);
    } catch (error) {
      this.showToastMessage('common.error');
    }
  }

  /**
   * Show toast message
   */
  private showToastMessage(key: string): void {
    this.translateService.get(key).subscribe((msg) => {
      this.toastMessage.set(msg);
      this.showToast.set(true);
      setTimeout(() => this.showToast.set(false), 3000);
    });
  }
}