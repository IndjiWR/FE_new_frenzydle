import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader component for loading states
 * Displays pulsing placeholder cards
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  /**
   * Number of skeleton cards to display
   */
  @Input() count: number = 3;

  /**
   * Type of skeleton (card, text, circle)
   */
  @Input() type: 'card' | 'text' | 'circle' = 'card';

  /**
   * Custom width (for text type)
   */
  @Input() width: string = '100%';

  /**
   * Custom height (for text type)
   */
  @Input() height: string = '1rem';

  /**
   * Generate array for ngFor
   */
  get items(): number[] {
    return Array(this.count).fill(0);
  }
}