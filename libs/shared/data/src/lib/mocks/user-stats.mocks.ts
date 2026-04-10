import { UserStats, ActivityByDay, GameStats } from '../models';

/**
 * Generate activity data for the last 30 days
 */
function generateActivityByDay(): ActivityByDay[] {
  const activity: ActivityByDay[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Varied activity - some days more, some less
    let gamesPlayed: number;
    const dayOfWeek = date.getDay();

    if (i === 0) {
      gamesPlayed = 2; // Today
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend - more games
      gamesPlayed = Math.floor(Math.random() * 4) + 2; // 2-5
    } else {
      // Weekday - fewer games
      gamesPlayed = Math.floor(Math.random() * 3); // 0-2
    }

    activity.push({
      date: date.toISOString().split('T')[0],
      gamesPlayed,
    });
  }

  return activity;
}

/**
 * Mock user statistics
 * Simulates a returning user with a 5-day streak and ~72% win rate
 */
export const MOCK_USER_STATS: UserStats = {
  totalGamesPlayed: 47,
  winRate: 72,
  currentStreak: 5,
  bestStreak: 12,
  avgAttempts: 3.4,
  activityByDay: generateActivityByDay(),
  perGame: [
    {
      gameId: 'dragonball',
      gameName: 'Dragon Ball',
      totalPlayed: 35,
      winRate: 74,
      currentStreak: 5,
      bestStreak: 12,
      avgAttempts: 3.2,
    },
    {
      gameId: 'naruto',
      gameName: 'Naruto',
      totalPlayed: 12,
      winRate: 67,
      currentStreak: 0,
      bestStreak: 3,
      avgAttempts: 4.1,
    },
  ],
};

/**
 * Generate guest stats (minimal)
 */
export const MOCK_GUEST_STATS: UserStats = {
  totalGamesPlayed: 0,
  winRate: 0,
  currentStreak: 0,
  bestStreak: 0,
  avgAttempts: 0,
  activityByDay: [],
  perGame: [],
};