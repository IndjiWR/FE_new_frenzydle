import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
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
   * Mobile menu open state
   */
  isMobileMenuOpen = signal<boolean>(false);

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
   * Handle login click
   */
  onLoginClick(): void {
    this.loginClick.emit();
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    this.logoutClick.emit();
  }
}