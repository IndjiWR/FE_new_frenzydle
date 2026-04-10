# FrenzyDle Documentation

## Table of Contents

1. [Current Status](#current-status)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Library Boundaries](#library-boundaries)
5. [Testing Strategy](#testing-strategy)
6. [API Contract](#api-contract)
7. [Environment Configuration](#environment-configuration)
8. [How to Run Tests](#how-to-run-tests)
9. [Shared Components Usage](#shared-components-usage)
10. [Styling Guidelines](#styling-guidelines)
11. [i18n (Internationalization)](#i18n-internationalization)
12. [Adding New Features](#adding-new-features)

---

## Current Status

**Step: 4 - User Page Complete**

**Last Updated:** 2026-04-10

### Done and Working

#### Step 2 - Homepage (Complete)
- ✅ All UI components created (Logo, NavBar, LanguageSwitcher, MobileMenu, GameCard, CountdownTimer, SkeletonLoader, ErrorState, EmptyState)
- ✅ All feature components created (HeroSection, GameGrid)
- ✅ GameService with getGames() and getDailyStatus()
- ✅ Mock interceptor handling `/api/games` and `/api/games/:id/daily-status`
- ✅ Game models (GameTheme, GameDailyStatus, GameWithStatus)
- ✅ ngx-translate configured with HTTP loader
- ✅ i18n files for all 5 languages (en, it, fr, es, pt)
- ✅ Tailwind animations configured (logo-scale, stagger-fade-up, slide-in-right)
- ✅ Tailwind fonts configured (Fredoka One display font)
- ✅ LanguageSwitcher desktop click bug fixed (blur → HostListener)
- ✅ E2E tests for homepage (navigation, hero, game grid, language switcher)
- ✅ Storybook stories created for all UI components
- ✅ Test coverage improved (Jest configs fixed, shared libraries at 97%+)

#### Step 3 - Authentication (Complete)
- ✅ Auth models (auth.models.ts) - UserProfile, CheckEmailResponse, request/response types
- ✅ AuthService with signal-based state - currentUser, isLoggedIn, isGuest, displayName
- ✅ CSRF Interceptor - adds X-CSRF-Token header to mutating requests
- ✅ Mock auth endpoints - /api/auth/* endpoints fully mocked
- ✅ AuthModalService - manages modal state (open, close, step routing)
- ✅ AuthModal component - 3-step flow (method selection → form → success)
- ✅ Auth route guard - protects /user route, opens modal for guests
- ✅ APP_INITIALIZER integration - auth state initialized before app renders
- ✅ NavBar updates - user dropdown with login, settings, logout
- ✅ ThemeService - light/dark theme toggle with localStorage persistence
- ✅ Dark mode styling - all components styled for dark mode
- ✅ Mobile menu user options - login/logout, settings, theme toggle for mobile
- ✅ Backend integration documentation - docs/BACKEND_INTEGRATION.md
- ✅ Environment configuration - useMocks flag to toggle mock/real backend
- ✅ Unit tests for auth (≥85% coverage)

#### Step 4 - User Page (Complete)
- ✅ User page with tabbed layout (Stats, Achievements, Settings)
- ✅ UserProfileHeader component - avatar, editable displayName, email display, guest badge
- ✅ Stats Tab - 4 summary cards (total games, win rate, streak, avg attempts)
- ✅ SVG line chart for 30-day activity with game filter
- ✅ Achievements Tab - 12 achievements in 3 categories (playing, performance, customisation)
- ✅ Progress bars, unlock badges, toast notification on click
- ✅ Settings Tab - account (display name, email, password), preferences (language, theme), danger zone
- ✅ Guest Teaser component - blurred overlay with sign-in CTA
- ✅ UserProfileService with signals - userStats, achievementsByCategory
- ✅ Mock API endpoints - GET /api/user/stats, PUT /api/user/profile, PUT /api/user/password, DELETE /api/user/data
- ✅ Mock achievements endpoint - GET /api/achievements, GET /api/achievements/user
- ✅ AuthGuard updated - guests can access /user with `allowGuest: true` route data
- ✅ Child routes configured - /user/stats, /user/achievements, /user/settings
- ✅ i18n translations - user page keys in all 5 languages
- ✅ Unit tests for user page components (73 tests passing)
- ✅ Build succeeds: `npx nx build frenzydle`

### Incomplete / TODO

- ⬜ E2E tests for auth flows (Cypress)
- ⬜ E2E tests for user page flows (Cypress)
- ⬜ Storybook for new auth components
- ⬜ Storybook for user page components

### Architecture Decisions

1. **Signal-based auth state**: No localStorage for tokens - auth state lives in memory via Angular signals only. Sessions managed server-side via httpOnly cookies.

2. **Guest-first approach**: Users automatically get guest sessions on cold start. Guest accounts can be converted to registered accounts.

3. **Mock interceptor pattern**: All API calls intercepted when `useMocks: true`. Toggle via environment configuration.

4. **Theme persistence**: Theme preference (light/dark) stored in localStorage, system preference as fallback.

5. **Dark mode via Tailwind**: Uses `darkMode: 'class'` in tailwind.config.js, applied via `.dark` class on `<html>` element.

### Commands to Resume

```bash
# Start dev server
npx nx serve frenzydle

# Run all unit tests
npx nx run-many -t test --projects=shared-ui,shared-feature,shared-data,frenzydle

# Run specific library tests
npx nx test shared-ui
npx nx test shared-feature
npx nx test shared-data

# Build for production
npx nx build frenzydle

# Run E2E tests
npx nx e2e frenzydle-e2e

# Start Storybook
npx nx storybook shared-ui
```

---

## Project Structure

### Applications

- **frenzydle**: Main Angular application containing the platform shell
- **frenzydle-e2e**: Cypress E2E tests

### Libraries

#### Shared Libraries (cross-cutting concerns)

| Library | Path | Purpose |
|---------|------|---------|
| shared-ui | `libs/shared/ui` | Dumb UI components (NavBar, GameCard, Logo, AuthModal, etc.) |
| shared-data | `libs/shared/data` | Services, models, HTTP interceptors, mock data, guards |
| shared-feature | `libs/shared/feature` | Smart components (HeroSection, GameGrid, AuthModalService) |

#### Game Libraries (scoped per game)

| Library | Path | Purpose |
|---------|------|---------|
| dragonball-ui | `libs/games/dragonball/ui` | Dragon Ball specific UI components |
| dragonball-data | `libs/games/dragonball/data` | Dragon Ball services and models |
| dragonball-feature | `libs/games/dragonball/feature` | Dragon Ball pages and smart components |

---

## Architecture Overview

### Design Principles

1. **Standalone Components**: All components use Angular standalone APIs
2. **Signals**: State management uses Angular signals (no RxJS where signals suffice)
3. **NX Boundaries**: Enforced library boundaries prevent cross-game imports
4. **Mock-First Development**: All API calls are mocked by default

### Application Shell

```
┌─────────────────────────────────────────┐
│              App Shell                   │
│  ┌─────────────────────────────────┐    │
│  │           Router                 │    │
│  │  / (home)  │  /user  │  /games  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │           NavBar                │    │
│  │  Logo │ Games │ User Avatar     │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │        Router Outlet             │    │
│  │         (Pages)                  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COLD START                                    │
│  1. App loads → APP_INITIALIZER calls GET /api/auth/me              │
│     ├─ 200: Session exists, user restored                           │
│     └─ 401: No session → POST /api/auth/guest (create guest user)   │
│                                                                      │
│                        GUEST USER                                    │
│  2. User plays games as guest (streak/game state persisted)          │
│                                                                      │
│                    EMAIL SIGN-IN FLOW                                │
│  3. User enters email → POST /api/auth/check-email                  │
│     Response: { exists: boolean, suggestedAction: 'login'|'convert'|'register' }
│                                                                      │
│  4a. LOGIN (existing user): POST /api/auth/login                   │
│  4b. CONVERT (guest → registered): POST /api/auth/convert           │
│  4c. REGISTER (new user): POST /api/auth/register                   │
│                                                                      │
│                    THEME PREFERENCE                                   │
│  - Stored in localStorage (key: 'frenzydle_theme')                   │
│  - Applies 'dark' or 'light' class to <html> element                │
│  - Fallback to system preference                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Library Boundaries

### NX Boundary Rules

```json
{
  "rules": {
    "shared-ui": ["shared-ui"],
    "shared-data": ["shared-data"],
    "shared-feature": ["shared-feature", "shared-ui", "shared-data"],
    "dragonball-ui": ["dragonball-ui", "shared-ui"],
    "dragonball-data": ["dragonball-data", "shared-data"],
    "dragonball-feature": ["dragonball-feature", "dragonball-ui", "dragonball-data", "shared-feature", "shared-ui", "shared-data"],
    "frenzydle": ["*"]
  }
}
```

### Import Rules

- ✅ `shared-feature` can import from `shared-ui` and `shared-data`
- ✅ `dragonball-feature` can import from `dragonball-ui`, `dragonball-data`, and all shared libs
- ❌ `shared-ui` cannot import from any other library
- ❌ `dragonball-ui` cannot import from `dragonball-data` or other game libs

---

## Testing Strategy

### Unit Tests (Jest)

**Coverage Requirement**: ≥ 85%

```bash
# Run all tests
npx nx run-many -t test

# Run specific project tests
npx nx test frenzydle
npx nx test shared-ui

# Run with coverage
npx nx test frenzydle --coverage

# View coverage report
open coverage/apps/frenzydle/lcov-report/index.html
```

### Test File Conventions

- Unit tests: `*.spec.ts` adjacent to source files
- Test directory mirrors source structure
- Use Jest matchers (`expect().toBe()`, `jest.spyOn()`, etc.)

### E2E Tests (Cypress)

```bash
# Run E2E tests
npx nx e2e frenzydle-e2e

# Open Cypress UI
npx nx e2e frenzydle-e2e --watch
```

### Test Setup Files

- `jest.config.ts` - Root Jest configuration
- `apps/*/jest.config.ts` - Project-specific Jest config
- `apps/*/test-setup.ts` - TestBed initialization

---

## API Contract

### Endpoints

All API endpoints are prefixed with `/api`. When `useMocks: true`, responses are mocked with simulated latency (400-700ms).

See `docs/BACKEND_INTEGRATION.md` for complete API documentation including:
- Authentication endpoints (login, register, guest, logout, etc.)
- Request/response formats
- Error codes
- Security considerations

#### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List all available games |
| GET | `/api/games/:gameId` | Get game details |
| GET | `/api/games/:gameId/daily-status` | Get user's daily status for a game |

#### Authentication (see docs/BACKEND_INTEGRATION.md for full details)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/csrf` | Get CSRF token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/guest` | Create guest session |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/convert` | Convert guest to registered |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout current user |
| POST | `/api/auth/check-email` | Check if email exists |

### Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}
```

### TypeScript Interfaces

```typescript
// Game-related types
interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
}

interface GameDailyStatus {
  streakCount: number;
  attemptsUsed: number;
  maxAttempts: number;
  isCompletedToday: boolean;
  nextResetAt: string; // ISO timestamp
}

interface GameWithStatus {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  theme: GameTheme;
  isReleased: boolean;
  modes: GameMode[];
  status?: GameDailyStatus;
}

// Auth-related types
interface UserProfile {
  id: string;
  displayName: string;
  email: string | null;
  isGuest: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

interface CheckEmailResponse {
  exists: boolean;
  suggestedAction: 'login' | 'convert' | 'register';
}

// User Stats types
interface UserStats {
  totalGamesPlayed: number;
  winRate: number; // 0-100
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number;
  activityByDay: ActivityByDay[];
  perGame: GameStats[];
}

interface ActivityByDay {
  date: string; // ISO date
  gamesPlayed: number;
}

interface GameStats {
  gameId: string;
  gameName: string;
  totalPlayed: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number;
}

// Achievement types
type AchievementCategory = 'playing' | 'performance' | 'customisation';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  unlockCondition: string;
  maxProgress: number;
  iconType: string;
  unlocksAvatarItem?: string;
}

interface UserAchievement {
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

// Language configuration
interface Language {
  code: string;
  name: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];
```

---

## Environment Configuration

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  useMocks: true,        // Enable mocked API responses
  simulateError: false,  // Set to true to test error states
  apiBaseUrl: '/api',
};
```

### Production (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  useMocks: false,  // Use real backend
  apiBaseUrl: '/api',
};
```

### Mock Interceptor

The `mockInterceptor` in `libs/shared/data/src/lib/interceptors/mock.interceptor.ts` intercepts all HTTP requests when `useMocks: true`.

```typescript
// Environment injection in components
import { environment } from '../environments/environment';

if (environment.useMocks) {
  // Mock responses enabled
}
```

#### Toggling Mock Mode

**Development (mocks enabled):**
- Set `useMocks: true` in `environment.ts`
- All API calls return mock data with simulated latency (400-700ms)
- No backend server required

**Production (real API):**
- Set `useMocks: false` in `environment.prod.ts`
- All API calls go to the real backend at `apiBaseUrl`
- CSRF interceptor adds tokens to mutating requests

**Simulating Errors:**
- Set `simulateError: true` in `environment.ts` to test error states
- Mock interceptor will return error responses instead of success

#### Mock Data Structure

The mock interceptor provides:

```typescript
// Games
GET /api/games → GameWithStatus[]
GET /api/games/:id → GameWithStatus
GET /api/games/:id/daily-status → GameDailyStatus

// Auth (fully mocked)
GET /api/auth/csrf → { token: "mock-csrf-token" }
GET /api/auth/me → { user: UserProfile } | 401
POST /api/auth/guest → { user: UserProfile }
POST /api/auth/login → { user: UserProfile }
POST /api/auth/register → { user: UserProfile }
POST /api/auth/convert → { user: UserProfile }
POST /api/auth/google → { user: UserProfile }
POST /api/auth/logout → { success: true }
POST /api/auth/check-email → { exists: boolean, suggestedAction: string }

// User Profile
GET /api/user/stats → UserStats
PUT /api/user/profile → { displayName: string }
PUT /api/user/password → { currentPassword: string, newPassword: string }
DELETE /api/user/data → { success: true }

// Achievements
GET /api/achievements → Achievement[]
GET /api/achievements/user → UserAchievement[]

// Leaderboard (planned)
GET /api/leaderboard/:gameId
GET /api/leaderboard/:gameId/me
```

---

## How to Run Tests

### Unit Tests

```bash
# All projects
npx nx run-many -t test --all

# Specific project
npx nx test frenzydle
npx nx test shared-ui
npx nx test shared-data
npx nx test shared-feature

# Watch mode
npx nx test frenzydle --watch

# Coverage report
npx nx test frenzydle --coverage
```

### E2E Tests

```bash
# Run all E2E tests
npx nx e2e frenzydle-e2e

# Open Cypress interactive mode
npx nx e2e frenzydle-e2e --watch
```

### Storybook

```bash
# Start Storybook
npx nx storybook shared-ui

# Build Storybook
npx nx build-storybook shared-ui
```

---

## Shared Components Usage

### Importing from Shared Libraries

```typescript
// Import from shared-ui
import { NavBarComponent, GameCardComponent, LogoComponent, AuthModalComponent } from '@shared/ui';

// Import from shared-data
import { GameService, AuthService, ThemeService, UserProfileService, MOCK_GAMES, SUPPORTED_LANGUAGES } from '@shared/data';

// Import from shared-feature
import { HeroSectionComponent, GameGridComponent, AuthModalService } from '@shared/feature';
```

### Creating New Components

1. Create component in appropriate library
2. Export from `index.ts`
3. Add Storybook story (`.stories.ts`)
4. Add unit test (`.spec.ts`)

### Available UI Components

| Component | Purpose |
|-----------|---------|
| `LogoComponent` | Animated FrenzyDle logo with gradient |
| `NavBarComponent` | Sticky navigation bar with user menu, language switcher |
| `LanguageSwitcherComponent` | Language dropdown with persistence |
| `MobileMenuComponent` | Slide-in mobile menu with nav and user options |
| `GameCardComponent` | Game card with status, streak, countdown |
| `CountdownTimerComponent` | HH:MM:SS countdown display |
| `SkeletonLoaderComponent` | Pulsing placeholder for loading states |
| `ErrorStateComponent` | Error message with retry button |
| `EmptyStateComponent` | Empty state with optional CTA |
| `AuthModalComponent` | Authentication modal with multi-step flow |

### Available Feature Components

| Component | Purpose |
|-----------|---------|
| `HeroSectionComponent` | Hero with animated logo and typewriter |
| `GameGridComponent` | Responsive game grid with loading states |

### Available Services

| Service | Purpose |
|---------|---------|
| `GameService` | Fetch games and daily status |
| `AuthService` | Authentication state and operations |
| `ThemeService` | Light/dark theme management |
| `AuthModalService` | Modal state management |
| `UserProfileService` | User stats, achievements, and settings management |

---

## Styling Guidelines

### Tailwind CSS

All styling uses Tailwind utility classes. Custom CSS should be avoided unless absolutely necessary.

### Dark Mode

Dark mode is implemented using Tailwind's class-based dark mode:
- `darkMode: 'class'` in `tailwind.config.js`
- ThemeService applies `.dark` class to `<html>` element
- Use `dark:` prefix for dark mode variants (e.g., `dark:bg-zinc-800`)

```html
<!-- Example: Dark mode styling -->
<div class="bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100">
  Content adapts to theme
</div>
```

### Color Palette

| Color | Shades | Usage |
|-------|--------|-------|
| Lavender | 50-900 | Primary accent |
| Mint | 50-900 | Success states |
| Peach | 50-900 | Warning states |
| Sky Blue | 50-900 | Information states |
| Zinc | 50-900 | Dark mode backgrounds |

### Animation Classes

```html
<!-- Logo scale animation -->
<div class="animate-logo-scale">...</div>

<!-- Staggered fade up animation -->
<div class="animate-stagger-fade-up" style="animation-delay: 80ms">...</div>

<!-- Fade in animation -->
<div class="animate-fade-in">...</div>

<!-- Slide up animation -->
<div class="animate-slide-up">...</div>
```

### Responsive Design

- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

---

## i18n (Internationalization)

### Setup

The application uses `ngx-translate` for internationalization. Languages are stored in JSON files in `apps/frenzydle/src/assets/i18n/`.

### Using Translations

```html
<!-- In templates -->
<h1>{{ 'home.title' | translate }}</h1>
<p>{{ 'home.subtitle' | translate }}</p>

<!-- With parameters -->
<span>{{ 'game.streak' | translate:{ count: 3 } }}</span>
```

### Available Languages

| Code | Language | File |
|------|----------|------|
| en | English | en.json |
| it | Italiano | it.json |
| fr | Français | fr.json |
| es | Español | es.json |
| pt | Português | pt.json |

---

## Adding New Features

### Adding a New Game Card

1. Add game data to `libs/shared/data/src/lib/mocks/game.mocks.ts`:

```typescript
export const MOCK_GAMES: GameWithStatus[] = [
  // ... existing games
  {
    id: 'new-game',
    name: 'New Game',
    description: 'Game description',
    thumbnailUrl: 'assets/images/games/new-game.svg',
    theme: { primaryColor: '#FF0000', secondaryColor: '#00FF00' },
    isReleased: false, // or true if active
    modes: [/* ... */],
    status: { /* ... */ }
  }
];
```

2. Create SVG thumbnail in `apps/frenzydle/src/assets/images/games/`
3. The game will appear automatically in the grid

### Adding a New Translation Key

1. Add key to all language files (`en.json`, `it.json`, etc.):
```json
{
  "newSection": {
    "newKey": "New Value"
  }
}
```

2. Use in template: `{{ 'newSection.newKey' | translate }}`

### Adding a New UI Component

1. Create in `libs/shared/ui/src/lib/components/new-component/`
2. Export from `libs/shared/ui/src/lib/components/index.ts`
3. Add unit test and Storybook story

---

## Future Steps

1. ~~**Step 2**: Homepage~~ ✅ Complete
2. ~~**Step 3**: Authentication system~~ ✅ Complete
3. ~~**Step 4**: User settings page~~ ✅ Complete
4. **Step 5**: Avatar customization
5. **Step 6**: Dragon Ball game integration