import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LogoSize = 'sm' | 'md' | 'lg';

/**
 * Animated logo component for FrenzyDle branding
 * Features gradient text with background-clip and animated entrance
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  /**
   * Size variant: 'sm' (nav), 'md' (default), 'lg' (hero)
   */
  @Input() size: LogoSize = 'md';

  /**
   * Whether to animate on mount
   */
  @Input() animated: boolean = true;

  /**
   * Optional custom class
   */
  @Input() customClass: string = '';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'text-xl';
      case 'lg':
        return 'text-5xl';
      default:
        return 'text-3xl';
    }
  }

  get animationClass(): string {
    return this.animated ? 'animate-logo-scale' : '';
  }
}