/**
 * User statistics models
 */

export interface UserStats {
  totalGamesPlayed: number;
  winRate: number; // 0-100
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number; // e.g. 3.4
  activityByDay: ActivityByDay[];
  perGame: GameStats[];
}

export interface ActivityByDay {
  date: string; // ISO date "2026-03-15"
  gamesPlayed: number;
}

export interface GameStats {
  gameId: string;
  gameName: string;
  totalPlayed: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number;
}

/**
 * Achievement models
 */
export type AchievementCategory = 'playing' | 'performance' | 'customisation';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  unlockCondition: string;
  maxProgress: number;
  iconType: string; // used to pick SVG icon
  unlocksAvatarItem?: string; // for Step 5 wiring
}

export interface UserAchievement {
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null; // ISO timestamp
}

/**
 * Settings models
 */
export interface UpdateProfileRequest {
  displayName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}