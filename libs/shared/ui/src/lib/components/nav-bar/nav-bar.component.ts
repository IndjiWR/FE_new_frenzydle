import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  @Input() isLoggedIn: boolean = false;

  /**
   * User avatar URL
   */
  @Input() userAvatar: string = '';

  /**
   * User display name
   */
  @Input() userName: string = 'Guest';

  /**
   * Navigation items for the menu
   */
  @Input() navItems: NavItem[] = [
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ];

  /**
   * Emits when user clicks login
   */
  @Output() loginClick = new EventEmitter<void>();

  /**
   * Emits when user clicks logout
   */
  @Output() logoutClick = new EventEmitter<void>();

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

  /**
   * Track by for nav items
   */
  trackByPath(index: number, item: NavItem): string {
    return item.path;
  }
}