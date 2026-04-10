import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, ThemeService } from '@shared/data';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';

/**
 * User page component with tabbed layout
 *
 * Routes:
 * - /user → redirects to /user/stats
 * - /user/stats
 * - /user/achievements
 * - /user/settings
 */
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    UserProfileHeaderComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly router = inject(Router);

  // Current user info
  isLoggedIn = this.authService.isLoggedIn;
  isGuest = this.authService.isGuest;
  currentUser = this.authService.currentUser;
  isDarkTheme = this.themeService.isDark;

  // Tab configuration
  tabs = [
    { path: '/user/stats', label: 'user.tabs.stats', icon: 'chart' },
    { path: '/user/achievements', label: 'user.tabs.achievements', icon: 'trophy' },
    { path: '/user/settings', label: 'user.tabs.settings', icon: 'settings' },
  ];

  /**
   * Navigate to a specific tab
   */
  navigateToTab(path: string): void {
    this.router.navigateByUrl(path);
  }

  /**
   * Check if a tab is active
   */
  isTabActive(tabPath: string): boolean {
    return this.router.url.startsWith(tabPath);
  }
}