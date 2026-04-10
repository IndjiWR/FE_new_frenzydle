import { Achievement, UserAchievement } from '../models';

/**
 * Mock achievements
 * 12 achievements across 3 categories
 */
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  // === PLAYING CATEGORY ===
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Play your first game',
    category: 'playing',
    unlockCondition: 'Play 1 game',
    maxProgress: 1,
    iconType: 'game',
  },
  {
    id: 'ten-games',
    name: 'Getting Started',
    description: 'Play 10 games total',
    category: 'playing',
    unlockCondition: 'Play 10 games',
    maxProgress: 10,
    iconType: 'controller',
  },
  {
    id: 'streak-5',
    name: 'On Fire!',
    description: 'Achieve a 5-day playing streak',
    category: 'playing',
    unlockCondition: 'Play 5 days in a row',
    maxProgress: 5,
    iconType: 'flame',
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    description: 'Achieve a 10-day playing streak',
    category: 'playing',
    unlockCondition: 'Play 10 days in a row',
    maxProgress: 10,
    iconType: 'fire',
  },
  // === PERFORMANCE CATEGORY ===
  {
    id: 'first-win',
    name: 'Victory!',
    description: 'Win your first game',
    category: 'performance',
    unlockCondition: 'Win 1 game',
    maxProgress: 1,
    iconType: 'trophy',
  },
  {
    id: 'win-rate-50',
    name: 'Above Average',
    description: 'Maintain a 50% win rate over 10+ games',
    category: 'performance',
    unlockCondition: 'Reach 50% win rate',
    maxProgress: 50,
    iconType: 'chart',
  },
  {
    id: 'perfect-game',
    name: 'Perfect Guess',
    description: 'Win a game on your first attempt',
    category: 'performance',
    unlockCondition: 'Win with 1 attempt',
    maxProgress: 1,
    iconType: 'star',
  },
  {
    id: 'win-rate-75',
    name: 'Master Player',
    description: 'Maintain a 75% win rate over 20+ games',
    category: 'performance',
    unlockCondition: 'Reach 75% win rate',
    maxProgress: 75,
    iconType: 'crown',
  },
  // === CUSTOMISATION CATEGORY (locked until Step 5)
  {
    id: 'custom-avatar',
    name: 'Face Lift',
    description: 'Customize your avatar for the first time',
    category: 'customisation',
    unlockCondition: 'Change your avatar',
    maxProgress: 1,
    iconType: 'palette',
    unlocksAvatarItem: 'base-customization',
  },
  {
    id: 'avatar-hat',
    name: 'Hat Collector',
    description: 'Unlock your first hat',
    category: 'customisation',
    unlockCondition: 'Earn a hat through achievements',
    maxProgress: 1,
    iconType: 'hat',
    unlocksAvatarItem: 'hat-01',
  },
  {
    id: 'avatar-outfit',
    name: 'Fashion Forward',
    description: 'Unlock your first outfit',
    category: 'customisation',
    unlockCondition: 'Earn an outfit through achievements',
    maxProgress: 1,
    iconType: 'shirt',
    unlocksAvatarItem: 'outfit-01',
  },
  {
    id: 'avatar-legendary',
    name: 'Legendary Look',
    description: 'Unlock a legendary avatar item',
    category: 'customisation',
    unlockCondition: 'Complete all other achievements',
    maxProgress: 1,
    iconType: 'gem',
    unlocksAvatarItem: 'legendary-frame',
  },
];

/**
 * Mock user achievements
 * 4 unlocked, rest at varying progress
 */
export const MOCK_USER_ACHIEVEMENTS: UserAchievement[] = [
  // Unlocked
  {
    achievementId: 'first-game',
    currentProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-03-15T10:30:00.000Z',
  },
  {
    achievementId: 'first-win',
    currentProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-03-15T10:35:00.000Z',
  },
  {
    achievementId: 'streak-5',
    currentProgress: 5,
    isUnlocked: true,
    unlockedAt: '2026-04-09T18:00:00.000Z',
  },
  {
    achievementId: 'win-rate-50',
    currentProgress: 72,
    isUnlocked: true,
    unlockedAt: '2026-03-20T14:22:00.000Z',
  },
  // In progress
  {
    achievementId: 'ten-games',
    currentProgress: 47,
    isUnlocked: true,
    unlockedAt: '2026-03-18T09:15:00.000Z',
  },
  {
    achievementId: 'streak-10',
    currentProgress: 5,
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    achievementId: 'perfect-game',
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    achievementId: 'win-rate-75',
    currentProgress: 72,
    isUnlocked: false,
    unlockedAt: null,
  },
  // Customisation (all locked)
  {
    achievementId: 'custom-avatar',
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    achievementId: 'avatar-hat',
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    achievementId: 'avatar-outfit',
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    achievementId: 'avatar-legendary',
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  },
];

/**
 * Guest achievements (all at 0 progress)
 */
export const MOCK_GUEST_ACHIEVEMENTS: UserAchievement[] = MOCK_ACHIEVEMENTS.map(
  (achievement) => ({
    achievementId: achievement.id,
    currentProgress: 0,
    isUnlocked: false,
    unlockedAt: null,
  })
);