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
   * Emits when menu should close
   */
  close = output<void>();

  /**
   * Emits when a nav item is clicked
   */
  navigate = output<string>();

  onClose(): void {
    this.close.emit();
  }

  onNavigate(path: string): void {
    this.navigate.emit(path);
    this.onClose();
  }
}