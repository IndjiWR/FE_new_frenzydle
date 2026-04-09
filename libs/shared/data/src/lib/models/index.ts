// Environment configuration types
export interface Environment {
  production: boolean;
  useMocks: boolean;
  apiBaseUrl: string;
}

// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  stats: UserStats;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  accuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isLocked: boolean;
}

// Game-related types
export interface Game {
  id: string;
  name: string;
  description: string;
  theme: string;
  thumbnailUrl: string;
  isReleased: boolean;
  modes: GameMode[];
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'image';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Auth-related types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  provider?: 'guest' | 'credentials' | 'google';
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}