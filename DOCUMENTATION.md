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

**Step: 2 - Homepage Implementation**

**Last Updated:** 2026-04-10

### Done and Working

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
- ✅ Build succeeds: `npx nx build frenzydle`
- ✅ Unit tests pass: `npx nx test shared-ui shared-feature shared-data`
- ✅ E2E tests for homepage (navigation, hero, game grid, language switcher)
- ✅ Storybook stories created for all UI components
- ✅ Test coverage improved (Jest configs fixed, shared libraries at 97%+)

### Incomplete / TODO

- ⬜ Achieve 85% test coverage (currently lower)
- ✅ Create Storybook stories for all components (created, but Storybook build needs Angular builder migration)
- ✅ Write E2E Cypress tests for homepage
- ✅ Update README.md with run instructions
- ✅ Document mock interceptor toggle in this file

### Decisions Made Mid-Step

1. **ngx-translate over Angular i18n**: Chosen for runtime language switching (Angular i18n requires separate builds per language, impractical for language switcher feature)

2. **Signal-based state**: All component state uses Angular signals (no RxJS subjects) for reactivity

3. **Click-outside pattern for dropdowns**: LanguageSwitcher uses `@HostListener('document:click')` instead of `blur` event to properly handle desktop clicks (blur fires before click reaches dropdown options)

4. **Mock data structure**: Three mock games - Dragon Ball (active), Naruto (coming soon), One Piece (coming soon)

5. **GameModeLocal interface**: Defined locally in game.models.ts to avoid circular import issues

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

# Run E2E tests (not yet implemented)
npx nx e2e frenzydle-e2e

# Start Storybook (stories not yet created)
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
| shared-ui | `libs/shared/ui` | Dumb UI components (NavBar, GameCard, Logo, etc.) |
| shared-data | `libs/shared/data` | Services, models, HTTP interceptors, mock data |
| shared-feature | `libs/shared/feature` | Smart components (HeroSection, GameGrid) |

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

#### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List all available games |
| GET | `/api/games/:gameId` | Get game details |
| GET | `/api/games/:gameId/daily-status` | Get user's daily status for a game |

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/guest` | Guest login |
| POST | `/api/auth/logout` | Logout current user |
| POST | `/api/auth/refresh` | Refresh access token |

#### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update user profile |
| DELETE | `/api/user/data` | Delete all user data |
| PUT | `/api/user/avatar` | Update user avatar |

#### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard/:gameId` | Get game leaderboard |
| GET | `/api/leaderboard/:gameId/me` | Get user's rank |

#### Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/achievements` | Get all achievements |
| GET | `/api/achievements/user` | Get user's achievements |

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
  useMocks: true,  // Enable mocked API responses
  simulateError: false, // Set to true to test error states
  apiBaseUrl: '/api',
};
```

### Production (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  useMocks: false,
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

// Auth (planned)
POST /api/auth/login
POST /api/auth/register
POST /api/auth/google
POST /api/auth/guest
POST /api/auth/logout
POST /api/auth/refresh

// User (planned)
GET /api/user/profile
PUT /api/user/profile
DELETE /api/user/data
PUT /api/user/avatar

// Leaderboard (planned)
GET /api/leaderboard/:gameId
GET /api/leaderboard/:gameId/me

// Achievements (planned)
GET /api/achievements
GET /api/achievements/user
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
import { NavBarComponent, GameCardComponent, LogoComponent } from '@shared/ui';

// Import from shared-data
import { GameService, MOCK_GAMES, SUPPORTED_LANGUAGES } from '@shared/data';

// Import from shared-feature
import { HeroSectionComponent, GameGridComponent } from '@shared/feature';
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
| `NavBarComponent` | Sticky navigation bar with language switcher |
| `LanguageSwitcherComponent` | Language dropdown with persistence |
| `MobileMenuComponent` | Slide-in mobile menu |
| `GameCardComponent` | Game card with status, streak, countdown |
| `CountdownTimerComponent` | HH:MM:SS countdown display |
| `SkeletonLoaderComponent` | Pulsing placeholder for loading states |
| `ErrorStateComponent` | Error message with retry button |
| `EmptyStateComponent` | Empty state with optional CTA |

### Available Feature Components

| Component | Purpose |
|-----------|---------|
| `HeroSectionComponent` | Hero with animated logo and typewriter |
| `GameGridComponent` | Responsive game grid with loading states |

---

## Styling Guidelines

### Tailwind CSS

All styling uses Tailwind utility classes. Custom CSS should be avoided unless absolutely necessary.

### Color Palette

| Color | Shades | Usage |
|-------|--------|-------|
| Lavender | 50-900 | Primary accent |
| Mint | 50-900 | Success states |
| Peach | 50-900 | Warning states |
| Sky Blue | 50-900 | Information states |

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

1. **Step 3**: Authentication system
2. **Step 4**: User settings page
3. **Step 5**: Avatar customization
4. **Step 6**: Dragon Ball game integration