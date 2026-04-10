// Environment configuration types
export interface Environment {
  production: boolean;
  useMocks: boolean;
  simulateError?: boolean;
  apiBaseUrl: string;
}

// Extended game models for homepage
export * from './game.models';

// Auth-related models
export * from './auth.models';

// User stats and achievements models
export * from './user-stats.models';

// Avatar customization models
export * from './avatar.models';