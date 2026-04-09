import { GameWithStatus, GameDailyStatus } from '../models/game.models';

/**
 * Mock game data for homepage game grid
 */
export const MOCK_GAMES: GameWithStatus[] = [
  {
    id: 'dragonball',
    name: 'Dragon Ball',
    description: 'Guess the Dragon Ball character from clues! Test your knowledge of Saiyans, Namekians, and more.',
    thumbnailUrl: 'assets/images/games/dragonball.svg',
    theme: {
      primaryColor: '#FF6B00',
      secondaryColor: '#FFD700',
    },
    isReleased: true,
    modes: [
      { id: 'classic', name: 'Classic', description: 'Unlimited guesses with clues', type: 'text' },
      { id: 'challenge', name: 'Challenge', description: 'Limited guesses, harder clues', type: 'text' },
    ],
    status: {
      streakCount: 3,
      attemptsUsed: 2,
      maxAttempts: 6,
      isCompletedToday: false,
      nextResetAt: getNextMidnightUTC(),
    },
  },
  {
    id: 'naruto',
    name: 'Naruto',
    description: 'Identify ninjas from the Hidden Villages! From Genin to Kage, how well do you know the shinobi world?',
    thumbnailUrl: 'assets/images/games/naruto.svg',
    theme: {
      primaryColor: '#FF5F00',
      secondaryColor: '#1E3A5F',
    },
    isReleased: false,
    modes: [
      { id: 'classic', name: 'Classic', description: 'Unlimited guesses with clues', type: 'text' },
    ],
  },
  {
    id: 'onepiece',
    name: 'One Piece',
    description: 'Sail the Grand Line and guess the characters! Pirates, Marines, and Revolutionaries await!',
    thumbnailUrl: 'assets/images/games/onepiece.svg',
    theme: {
      primaryColor: '#E8001C',
      secondaryColor: '#FFD700',
    },
    isReleased: false,
    modes: [
      { id: 'classic', name: 'Classic', description: 'Unlimited guesses with clues', type: 'text' },
    ],
  },
];

/**
 * Mock daily status data per game
 */
export const MOCK_DAILY_STATUS: Record<string, GameDailyStatus> = {
  dragonball: {
    streakCount: 3,
    attemptsUsed: 2,
    maxAttempts: 6,
    isCompletedToday: false,
    nextResetAt: getNextMidnightUTC(),
  },
  naruto: {
    streakCount: 0,
    attemptsUsed: 0,
    maxAttempts: 6,
    isCompletedToday: false,
    nextResetAt: getNextMidnightUTC(),
  },
  onepiece: {
    streakCount: 0,
    attemptsUsed: 0,
    maxAttempts: 6,
    isCompletedToday: false,
    nextResetAt: getNextMidnightUTC(),
  },
};

/**
 * Helper function to get next midnight UTC as ISO string
 */
function getNextMidnightUTC(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Generate mock thumbnail SVG for a game
 * Used when actual image assets are not available
 */
export function getMockGameThumbnail(gameId: string, primaryColor: string, secondaryColor: string): string {
  // Returns a data URL for an SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grad-${gameId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad-${gameId})"/>
      <text x="100" y="100" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${gameId.charAt(0).toUpperCase() + gameId.slice(1)}
      </text>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}