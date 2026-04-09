import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiResponse, GameWithStatus, GameDailyStatus } from '../models';

/**
 * Service for managing game-related API calls
 */
@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  /**
   * Fetch all available games with their status
   */
  getGames(): Observable<GameWithStatus[]> {
    return this.http.get<ApiResponse<GameWithStatus[]>>(`${this.baseUrl}/games`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Failed to fetch games:', error);
        return of([]);
      })
    );
  }

  /**
   * Fetch a single game by ID
   */
  getGameById(gameId: string): Observable<GameWithStatus | null> {
    return this.http.get<ApiResponse<GameWithStatus>>(`${this.baseUrl}/games/${gameId}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Failed to fetch game ${gameId}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Fetch the daily status for a game
   */
  getDailyStatus(gameId: string): Observable<{ gameId: string; status: GameDailyStatus } | null> {
    return this.http
      .get<ApiResponse<{ gameId: string; status: GameDailyStatus }>>(
        `${this.baseUrl}/games/${gameId}/daily-status`
      )
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error(`Failed to fetch daily status for ${gameId}:`, error);
          return of(null);
        })
      );
  }

  /**
   * Calculate time remaining until next daily reset
   */
  getTimeUntilReset(nextResetAt: string): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const reset = new Date(nextResetAt);
    const diff = Math.max(0, reset.getTime() - now.getTime());

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  /**
   * Format time until reset as HH:MM:SS
   */
  formatTimeUntilReset(nextResetAt: string): string {
    const { hours, minutes, seconds } = this.getTimeUntilReset(nextResetAt);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}