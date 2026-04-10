import { Component, input, output, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from '../logo/logo.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { MobileMenuComponent, NavItem } from '../mobile-menu/mobile-menu.component';

/**
 * Navigation bar component
 * Sticky header with logo, nav links, language switcher, and user avatar
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    LogoComponent,
    LanguageSwitcherComponent,
    MobileMenuComponent,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  /**
   * Whether user is logged in
   */
  isLoggedIn = input<boolean>(false);

  /**
   * Whether user is a guest
   */
  isGuest = input<boolean>(true);

  /**
   * User avatar URL
   */
  userAvatar = input<string>('');

  /**
   * User display name
   */
  userName = input<string>('Guest');

  /**
   * Navigation items for the menu
   */
  navItems = input<NavItem[]>([
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ]);

  /**
   * Emits when user clicks login
   */
  loginClick = output<void>();

  /**
   * Emits when user clicks logout
   */
  logoutClick = output<void>();

  /**
   * Emits when user clicks settings
   */
  settingsClick = output<void>();

  /**
   * Whether dark theme is active
   */
  isDarkTheme = input<boolean>(false);

  /**
   * Emits when user clicks theme toggle
   */
  themeToggle = output<void>();

  /**
   * Mobile menu open state
   */
  isMobileMenuOpen = signal<boolean>(false);

  /**
   * User dropdown menu open state
   */
  isUserMenuOpen = signal<boolean>(false);

  constructor() {
    // Close dropdown when clicking outside
    effect((onCleanup) => {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-testid="user-menu-trigger"]') &&
            !target.closest('[data-testid="user-dropdown-menu"]')) {
          this.isUserMenuOpen.set(false);
        }
      };

      if (this.isUserMenuOpen()) {
        document.addEventListener('click', handleClick);
      }

      onCleanup(() => {
        document.removeEventListener('click', handleClick);
      });
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Toggle user dropdown menu
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  /**
   * Close user dropdown menu
   */
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  /**
   * Handle login click
   */
  onLoginClick(): void {
    this.closeUserMenu();
    this.loginClick.emit();
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    this.closeUserMenu();
    this.logoutClick.emit();
  }

  /**
   * Handle settings click
   */
  onSettingsClick(): void {
    this.closeUserMenu();
    this.settingsClick.emit();
  }

  /**
   * Handle theme toggle click
   */
  onThemeToggle(): void {
    this.themeToggle.emit();
  }
}