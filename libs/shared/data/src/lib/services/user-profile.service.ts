import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import {
  UserStats,
  Achievement,
  UserAchievement,
  UpdateProfileRequest,
} from '../models';

/**
 * User Profile Service
 *
 * Manages user statistics, achievements, and profile updates.
 * Uses Angular signals for reactive state management.
 */
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl: string;

  // Signal-based state
  private readonly _userStats = signal<UserStats | null>(null);
  private readonly _achievements = signal<Achievement[]>([]);
  private readonly _userAchievements = signal<UserAchievement[]>([]);
  private readonly _isLoadingStats = signal(false);
  private readonly _isLoadingAchievements = signal(false);

  // Public readonly signals
  readonly userStats = this._userStats.asReadonly();
  readonly achievements = this._achievements.asReadonly();
  readonly userAchievements = this._userAchievements.asReadonly();
  readonly isLoadingStats = this._isLoadingStats.asReadonly();
  readonly isLoadingAchievements = this._isLoadingAchievements.asReadonly();

  // Computed signals
  readonly unlockedAchievements = computed(() =>
    this._userAchievements().filter((a) => a.isUnlocked)
  );

  readonly achievementsWithProgress = computed(() => {
    const userAch = this._userAchievements();
    return this._achievements().map((achievement) => {
      const userProgress = userAch.find(
        (ua) => ua.achievementId === achievement.id
      );
      return {
        ...achievement,
        currentProgress: userProgress?.currentProgress ?? 0,
        isUnlocked: userProgress?.isUnlocked ?? false,
        unlockedAt: userProgress?.unlockedAt ?? null,
      };
    });
  });

  readonly achievementsByCategory = computed(() => {
    const withProgress = this.achievementsWithProgress();
    return {
      playing: withProgress.filter((a) => a.category === 'playing'),
      performance: withProgress.filter((a) => a.category === 'performance'),
      customisation: withProgress.filter((a) => a.category === 'customisation'),
    };
  });

  constructor() {
    // Get base URL from AuthService environment
    const env = this.authService['baseUrl'];
    this.baseUrl = '/api'; // Using mock endpoint prefix
  }

  /**
   * Load user statistics
   */
  async loadStats(): Promise<void> {
    this._isLoadingStats.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: UserStats }>(`${this.baseUrl}/user/stats`)
      );
      this._userStats.set(response.data);
    } catch (error) {
      console.error('Failed to load user stats:', error);
      throw error;
    } finally {
      this._isLoadingStats.set(false);
    }
  }

  /**
   * Load all achievements
   */
  async loadAchievements(): Promise<void> {
    this._isLoadingAchievements.set(true);
    try {
      const [achievementsRes, userAchievementsRes] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data: Achievement[] }>(`${this.baseUrl}/achievements`)
        ),
        firstValueFrom(
          this.http.get<{ data: UserAchievement[] }>(
            `${this.baseUrl}/achievements/user`
          )
        ),
      ]);

      this._achievements.set(achievementsRes.data);
      this._userAchievements.set(userAchievementsRes.data);
    } catch (error) {
      console.error('Failed to load achievements:', error);
      throw error;
    } finally {
      this._isLoadingAchievements.set(false);
    }
  }

  /**
   * Update display name
   * Updates both UserProfileService and AuthService currentUser signal
   */
  async updateDisplayName(name: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.put<{ data: { user: { displayName: string } } }>(
        `${this.baseUrl}/user/profile`,
        { displayName: name }
      )
    );

    // Update AuthService currentUser signal to keep nav bar in sync
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.authService.updateUser({
        ...currentUser,
        displayName: name,
      });
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.baseUrl}/user/password`, {
        currentPassword,
        newPassword,
      })
    );
  }

  /**
   * Delete all user data
   * Calls DELETE /api/user/data → auth logout flow
   */
  async deleteAccount(): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/user/data`)
    );

    // Clear local state
    this._userStats.set(null);
    this._achievements.set([]);
    this._userAchievements.set([]);

    // Trigger logout flow
    await firstValueFrom(this.authService.logout());
  }

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    await firstValueFrom(this.authService.logout());
  }

  /**
   * Clear all state (useful for guest mode)
   */
  clearState(): void {
    this._userStats.set(null);
    this._achievements.set([]);
    this._userAchievements.set([]);
  }
}