import { Component, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileService, AuthService, Achievement, AchievementCategory } from '@shared/data';
import { GuestTeaserComponent } from '../guest-teaser/guest-teaser.component';

/** Achievement with user progress info */
interface AchievementWithProgress extends Achievement {
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

/**
 * Achievements Tab Component
 *
 * Displays user achievements grouped by category.
 * Shows a teaser overlay for guests.
 */
@Component({
  selector: 'app-achievements-tab',
  standalone: true,
  imports: [CommonModule, TranslateModule, GuestTeaserComponent],
  templateUrl: './achievements-tab.component.html',
  styleUrls: ['./achievements-tab.component.css'],
})
export class AchievementsTabComponent {
  protected readonly userProfileService = inject(UserProfileService);
  protected readonly authService = inject(AuthService);

  isGuest = this.authService.isGuest;
  achievementsByCategory = this.userProfileService.achievementsByCategory;
  isLoading = this.userProfileService.isLoadingAchievements;

  // Toast state
  showToast = signal(false);
  toastAchievement = signal<string>('');

  // Categories for iteration
  categories: AchievementCategory[] = ['playing', 'performance', 'customisation'];

  constructor() {
    // Load achievements when component initializes
    effect(() => {
      if (!this.isGuest()) {
        this.userProfileService.loadAchievements();
      }
    });
  }

  /**
   * Get achievements for a category
   */
  getAchievementsForCategory(category: string): AchievementWithProgress[] {
    return this.achievementsByCategory()[category as AchievementCategory] || [];
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'playing':
        return '🎮';
      case 'performance':
        return '🏆';
      case 'customisation':
        return '🎨';
      default:
        return '⭐';
    }
  }

  /**
   * Get achievement icon SVG path based on iconType
   */
  getAchievementIcon(iconType: string): string {
    const icons: Record<string, string> = {
      game: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      controller: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
      flame: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
      fire: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M13.828 10.172a4 4 0 00-5.656 0c-.75.75-1.172 1.77-1.172 2.828s.422 2.078 1.172 2.828a4 4 0 005.656 0c.75-.75 1.172-1.77 1.172-2.828s-.422-2.078-1.172-2.828z',
      trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      crown: 'M12 2l3 7h7l-5.5 5.5L19 22H5l2.5-7.5L2 9h7l3-7z',
      palette: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      hat: 'M4 18h16M12 4c-4 0-7 2-7 5v7h14V9c0-3-3-5-7-5z',
      shirt: 'M6 2l2 4h8l2-4M8 6v16h8V6M4 10l4 4m8-4l4 4',
      gem: 'M12 2L2 7l10 15 10-15-10-5zm0 0v20',
    };
    return icons[iconType] || icons['star'];
  }

  /**
   * Handle achievement click - show toast if unlocked
   */
  onAchievementClick(achievement: AchievementWithProgress): void {
    if (achievement.isUnlocked) {
      this.toastAchievement.set(achievement.name);
      this.showToast.set(true);

      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        this.showToast.set(false);
      }, 2000);
    }
  }
}