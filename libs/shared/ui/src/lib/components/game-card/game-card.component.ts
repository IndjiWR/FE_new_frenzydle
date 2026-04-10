import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { GameWithStatus } from '@shared/data';

/**
 * Game card component for displaying game information on the homepage grid
 * Features hover effects, status badges, and countdown timer
 */
@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [RouterModule, TranslateModule, CountdownTimerComponent],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  /**
   * Game data to display
   */
  game = input<GameWithStatus | null>(null);

  /**
   * Animation delay for staggered entrance (ms)
   */
  animationDelay = input<number>(0);

  /**
   * Emits when the card is clicked
   */
  cardClick = output<string>();

  /**
   * Whether the game is released and playable
   */
  isReleased = computed(() => this.game()?.isReleased ?? false);

  /**
   * Whether the game has been completed today
   */
  isCompleted = computed(() => this.game()?.status?.isCompletedToday ?? false);

  /**
   * Get attempts used
   */
  attemptsUsed = computed(() => this.game()?.status?.attemptsUsed ?? 0);

  /**
   * Get max attempts
   */
  maxAttempts = computed(() => this.game()?.status?.maxAttempts ?? 6);

  /**
   * Get streak count
   */
  streakCount = computed(() => this.game()?.status?.streakCount ?? 0);

  /**
   * Get next reset time
   */
  nextResetAt = computed(() => this.game()?.status?.nextResetAt ?? null);

  /**
   * CSS style for animation delay
   */
  animationStyle = computed(() => ({
    'animation-delay': `${this.animationDelay()}ms`,
  }));

  /**
   * Generate a placeholder thumbnail SVG
   */
  getThumbnailUrl(): string {
    const game = this.game();
    if (game?.thumbnailUrl) {
      return game.thumbnailUrl;
    }

    // Generate placeholder SVG
    const primaryColor = game?.theme?.primaryColor ?? '#9333ea';
    const secondaryColor = game?.theme?.secondaryColor ?? '#c084fc';
    const name = game?.name ?? 'Game';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="150" fill="url(#grad)"/>
        <text x="100" y="75" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${name}
        </text>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  /**
   * Calculate attempts percentage for progress bar
   */
  getAttemptsPercentage(): number {
    const game = this.game();
    if (!game?.status || !game.status.maxAttempts) {
      return 0;
    }
    return (game.status.attemptsUsed / game.status.maxAttempts) * 100;
  }

  onCardClick(): void {
    const game = this.game();
    if (this.isReleased() && game) {
      this.cardClick.emit(game.id);
    }
  }
}