import { Component, inject, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NavBarComponent, AuthModalComponent } from '@shared/ui';
import { AuthService, ThemeService } from '@shared/data';
import { AuthModalService } from '@shared/feature';

/**
 * Main application component
 * Provides the app shell with navigation
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavBarComponent, AuthModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  protected readonly authModalService = inject(AuthModalService);

  protected title = 'FrenzyDle';

  /**
   * Whether user is logged in (from auth service)
   */
  isLoggedIn = this.authService.isLoggedIn;

  /**
   * Whether user is a guest (from auth service)
   */
  isGuest = this.authService.isGuest;

  /**
   * User avatar URL (from auth service) - fallback for legacy avatars
   */
  userAvatar = computed(() => this.authService.currentUser()?.avatarUrl ?? '');

  /**
   * User avatar data (for custom avatars)
   */
  userAvatarData = computed(() => this.authService.currentUser()?.avatarData ?? null);

  /**
   * User display name (from auth service)
   */
  userName = this.authService.displayName;

  /**
   * Whether dark theme is active
   */
  isDarkTheme = this.themeService.isDark;

  /**
   * Navigation items
   */
  navItems = [
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ];

  /**
   * Handle login click - opens auth modal
   */
  onLoginClick(): void {
    this.authModalService.open();
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    this.authService.logout();
  }

  /**
   * Handle settings click - navigate to user settings page
   */
  onSettingsClick(): void {
    this.router.navigate(['/user/settings']);
  }

  /**
   * Handle theme toggle click
   */
  onThemeToggle(): void {
    this.themeService.toggle();
  }
}