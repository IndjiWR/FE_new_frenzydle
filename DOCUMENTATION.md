# FrenzyDle Documentation

## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Library Boundaries](#library-boundaries)
4. [Testing Strategy](#testing-strategy)
5. [API Contract](#api-contract)
6. [Environment Configuration](#environment-configuration)
7. [How to Run Tests](#how-to-run-tests)
8. [Shared Components Usage](#shared-components-usage)
9. [Styling Guidelines](#styling-guidelines)

---

## Project Structure

### Applications

- **frenzydle**: Main Angular application containing the platform shell
- **frenzydle-e2e**: Cypress E2E tests

### Libraries

#### Shared Libraries (cross-cutting concerns)

| Library | Path | Purpose |
|---------|------|---------|
| shared-ui | `libs/shared/ui` | Dumb UI components (buttons, modals, cards) |
| shared-data | `libs/shared/data` | Services, models, HTTP interceptors, auth state |
| shared-feature | `libs/shared/feature` | Smart components, auth flow, user settings |

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
│  │           Router                │    │
│  │  / (home)  │  /user  │  /games │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │        Nav Bar                   │    │
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

# Run with coverage
npx nx test frenzydle --coverage

# View coverage report
open coverage/apps/frenzydle/lcov-report/index.html
```

### Test File Conventions

- Unit tests: `*.spec.ts` adjacent to source files
- Test directory mirrors source structure
- Use Angular Testing Library patterns

### E2E Tests (Cypress)

```bash
# Run E2E tests
npx nx e2e frenzydle-e2e

# Open Cypress UI
npx nx e2e frenzydle-e2e --watch
```

### Test Setup Files

- `jest.config.ts` - Root Jest configuration
- `jest.setup.ts` - Global Jest setup
- `apps/*/jest.config.ts` - Project-specific Jest config

---

## API Contract

### Endpoints

All API endpoints are prefixed with `/api`. When `useMocks: true`, responses are mocked with simulated latency (300-800ms).

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

#### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List all available games |
| GET | `/api/games/:gameId` | Get game details |
| GET | `/api/games/:gameId/daily` | Get daily challenge |

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

---

## Environment Configuration

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  useMocks: true,  // Enable mocked API responses
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

---

## How to Run Tests

### Unit Tests

```bash
# All projects
npx nx run-many -t test

# Specific project
npx nx test frenzydle
npx nx test shared-ui
npx nx test shared-data

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
import { ButtonComponent } from '@shared/ui';

// Import from shared-data
import { mockInterceptor, User, Game } from '@shared/data';

// Import from shared-feature
import { AuthGuard } from '@shared/feature';
```

### Creating New Components

1. Create component in appropriate library
2. Export from `index.ts`
3. Add Storybook story (`.stories.ts`)
4. Add unit test (`.spec.ts`)

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
<!-- Fade in animation -->
<div class="animate-fade-in">...</div>

<!-- Slide up animation -->
<div class="animate-slide-up">...</div>

<!-- Typewriter effect -->
<div class="animate-typewriter">...</div>
```

### Responsive Design

- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

---

## Future Steps

1. **Step 2**: Homepage with game grid and mock API
2. **Step 3**: Authentication system
3. **Step 4**: User settings page
4. **Step 5**: Avatar customization