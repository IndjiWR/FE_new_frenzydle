import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GameCardComponent, SkeletonLoaderComponent, ErrorStateComponent, EmptyStateComponent } from '@shared/ui';
import { GameWithStatus } from '@shared/data';

export type GameGridState = 'loading' | 'loaded' | 'error' | 'empty';

/**
 * Game grid component for displaying games on the homepage
 * Handles loading, error, and empty states
 * Provides staggered animation for cards
 */
@Component({
  selector: 'app-game-grid',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    GameCardComponent,
    SkeletonLoaderComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent {
  /**
   * Games to display
   */
  games = input<GameWithStatus[]>([]);

  /**
   * Current state of the grid
   */
  state = input<GameGridState>('loading');

  /**
   * Error message to display
   */
  errorMessage = input<string>('');

  /**
   * Emits when a game card is clicked
   */
  gameClick = output<string>();

  /**
   * Emits when retry button is clicked
   */
  retry = output<void>();

  /**
   * Stagger animation delay per card (ms)
   */
  animationDelayMs = 80;

  /**
   * Computed animation delay for each game
   */
  getAnimationDelay(index: number): number {
    return index * this.animationDelayMs;
  }

  /**
   * Handle game card click
   */
  onGameClick(gameId: string): void {
    this.gameClick.emit(gameId);
  }

  /**
   * Handle retry button click
   */
  onRetry(): void {
    this.retry.emit();
  }
}