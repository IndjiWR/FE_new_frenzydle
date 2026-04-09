import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '@shared/ui';

/**
 * Main application component
 * Provides the app shell with navigation
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'FrenzyDle';

  /**
   * Whether user is logged in (placeholder for auth)
   */
  isLoggedIn = signal(false);

  /**
   * User avatar URL (placeholder for auth)
   */
  userAvatar = '';

  /**
   * User display name (placeholder for auth)
   */
  userName = 'Guest';

  /**
   * Navigation items
   */
  navItems = [
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ];

  /**
   * Handle login click
   */
  onLoginClick(): void {
    // TODO: Implement login modal/navigation
    console.log('Login clicked');
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    // TODO: Implement logout
    this.isLoggedIn.set(false);
  }
}