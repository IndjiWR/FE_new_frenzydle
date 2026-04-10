import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

/**
 * Mobile menu component for responsive navigation
 * Slide-in drawer from right side
 */
@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  /**
   * Whether the menu is open
   */
  isOpen = input<boolean>(false);

  /**
   * Navigation items
   */
  navItems = input<NavItem[]>([
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ]);

  /**
   * Whether user is logged in
   */
  isLoggedIn = input<boolean>(false);

  /**
   * Whether user is a guest
   */
  isGuest = input<boolean>(true);

  /**
   * User display name
   */
  userName = input<string>('Guest');

  /**
   * Whether dark theme is active
   */
  isDarkTheme = input<boolean>(false);

  /**
   * Emits when menu should close
   */
  close = output<void>();

  /**
   * Emits when a nav item is clicked
   */
  navigate = output<string>();

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
   * Emits when user clicks theme toggle
   */
  themeToggle = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onNavigate(path: string): void {
    this.navigate.emit(path);
    this.onClose();
  }

  onLoginClick(): void {
    this.loginClick.emit();
    this.onClose();
  }

  onLogoutClick(): void {
    this.logoutClick.emit();
    this.onClose();
  }

  onSettingsClick(): void {
    this.settingsClick.emit();
    this.onClose();
  }

  onThemeToggle(): void {
    this.themeToggle.emit();
    // Don't close menu on theme toggle - user might want to toggle back
  }
}