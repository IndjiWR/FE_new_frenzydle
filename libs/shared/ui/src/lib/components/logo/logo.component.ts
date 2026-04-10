import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type LogoSize = 'sm' | 'md' | 'lg';

/**
 * Animated logo component for FrenzyDle branding
 * Features gradient text with background-clip and animated entrance
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  /**
   * Size variant: 'sm' (nav), 'md' (default), 'lg' (hero)
   */
  size = input<LogoSize>('md');

  /**
   * Whether to animate on mount
   */
  animated = input<boolean>(true);

  /**
   * Optional custom class
   */
  customClass = input<string>('');

  sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'text-xl';
      case 'lg':
        return 'text-5xl';
      default:
        return 'text-3xl';
    }
  });

  animationClass = computed(() => {
    return this.animated() ? 'animate-logo-scale' : '';
  });
}