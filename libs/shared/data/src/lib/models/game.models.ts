/**
 * Extended game models for homepage and game grid functionality
 */

// Theme configuration for each game
export interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
}

// Daily status for a game (per user)
export interface GameDailyStatus {
  streakCount: number;
  attemptsUsed: number;
  maxAttempts: number;
  isCompletedToday: boolean;
  nextResetAt: string; // ISO timestamp
}

// Game mode (defined here to avoid circular imports)
export interface GameModeLocal {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'image';
}

// Game with status information for display on homepage
export interface GameWithStatus {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  theme: GameTheme;
  isReleased: boolean;
  modes: GameModeLocal[];
  status?: GameDailyStatus;
}

// API response for games list
export interface GamesListResponse {
  games: GameWithStatus[];
}

// API response for daily status
export interface DailyStatusResponse {
  gameId: string;
  status: GameDailyStatus;
}

// Language configuration
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Supported languages
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Local storage key for language preference
export const LANGUAGE_STORAGE_KEY = 'frenzydle_language';