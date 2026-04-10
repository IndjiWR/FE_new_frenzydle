import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent, GameGridComponent, GameGridState } from '@shared/feature';
import { GameService, GameWithStatus } from '@shared/data';

/**
 * Home page component
 * Displays hero section and game grid
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent, GameGridComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly gameService = inject(GameService);

  /**
   * Games to display
   */
  games = signal<GameWithStatus[]>([]);

  /**
   * Current state of the grid
   */
  gridState = signal<GameGridState>('loading');

  /**
   * Error message to display
   */
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadGames();
  }

  /**
   * Load games from the API
   */
  loadGames(): void {
    this.gridState.set('loading');

    this.gameService.getGames().subscribe({
      next: (games) => {
        if (games.length === 0) {
          this.gridState.set('empty');
        } else {
          this.games.set(games);
          this.gridState.set('loaded');
        }
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.errorMessage.set('errors.loadGames');
        this.gridState.set('error');
      },
    });
  }

  /**
   * Handle game card click
   */
  onGameClick(gameId: string): void {
    // Navigate to game page
    console.log('Game clicked:', gameId);
    // TODO: Navigate to game page when implemented
  }

  /**
   * Handle retry button click
   */
  onRetry(): void {
    this.loadGames();
  }
}