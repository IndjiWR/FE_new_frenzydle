import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * Skeleton loader component for loading states
 * Displays pulsing placeholder cards
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  /**
   * Number of skeleton cards to display
   */
  count = input<number>(3);

  /**
   * Type of skeleton (card, text, circle)
   */
  type = input<'card' | 'text' | 'circle'>('card');

  /**
   * Custom width (for text type)
   */
  width = input<string>('100%');

  /**
   * Custom height (for text type)
   */
  height = input<string>('1rem');

  /**
   * Generate array for @for loop
   */
  items = computed(() => Array(this.count()).fill(0));
}