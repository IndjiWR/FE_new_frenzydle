import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  /**
   * Whether the menu is open
   */
  @Input() isOpen: boolean = false;

  /**
   * Navigation items
   */
  @Input() navItems: NavItem[] = [
    { label: 'nav.home', path: '/' },
    { label: 'nav.games', path: '/games' },
  ];

  /**
   * Emits when menu should close
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Emits when a nav item is clicked
   */
  @Output() navigate = new EventEmitter<string>();

  onClose(): void {
    this.close.emit();
  }

  onNavigate(path: string): void {
    this.navigate.emit(path);
    this.onClose();
  }
}