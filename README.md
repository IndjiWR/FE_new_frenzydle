# FrenzyDle

FrenzyDle is a container platform for daily quiz games (Wordle/Gamedle-style). The platform comes first; games are plugged in later.

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode (with mock API)
npx nx serve frenzydle

# Or using npm scripts
npm start
```

The application will be available at `http://localhost:4200`.

### Running Tests

```bash
# Unit tests for all shared libraries
npx nx run-many -t test --projects=shared-ui,shared-feature,shared-data

# Unit tests for main app
npx nx test frenzydle

# Run all tests with coverage
npx nx run-many -t test --all --coverage

# E2E tests (requires dev server running)
npx nx e2e frenzydle-e2e

# Open Cypress interactive mode
npx nx e2e frenzydle-e2e --watch
```

### Building for Production

```bash
npx nx build frenzydle --configuration=production
```

### Storybook

```bash
# Start Storybook for UI components
npx nx storybook shared-ui

# Build static Storybook
npx nx build-storybook shared-ui
```

## Project Structure

```
apps/
  frenzydle/              ← Main Angular application
  frenzydle-e2e/          ← E2E tests (Cypress)

libs/
  shared/
    ui/                   ← Shared UI components (NavBar, GameCard, etc.)
    data/                 ← Shared services, models, interceptors
    feature/              ← Shared feature modules (HeroSection, GameGrid)
  games/
    dragonball/
      ui/                 ← Dragon Ball specific UI components
      data/               ← Dragon Ball specific services/models
      feature/            ← Dragon Ball specific pages/smart components
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npx nx serve frenzydle` | Start development server |
| `npx nx build frenzydle` | Build the application |
| `npx nx test frenzydle` | Run unit tests for main app |
| `npx nx test shared-ui` | Run shared-ui tests |
| `npx nx test shared-feature` | Run shared-feature tests |
| `npx nx test shared-data` | Run shared-data tests |
| `npx nx e2e frenzydle-e2e` | Run E2E tests |
| `npx nx storybook shared-ui` | Start Storybook for UI components |

## Tech Stack

- **Framework**: Angular 21 (standalone components + signals)
- **Styling**: Tailwind CSS v3
- **i18n**: ngx-translate
- **Testing**: Jest (unit tests), Cypress (E2E)
- **Documentation**: Storybook
- **Monorepo**: NX

## Features

### Step 1 - Project Setup ✅

- NX Monorepo structure
- Angular application with routing
- Tailwind CSS configuration
- Jest test setup
- Cypress E2E setup
- Storybook configuration
- HTTP interceptor scaffold
- Environment configuration with mock support

### Step 2 - Homepage ✅

- **Hero Section**: Animated logo with gradient text, typewriter subtitle
- **Navigation Bar**: Sticky nav with backdrop-blur, language switcher, mobile menu
- **Game Grid**: Responsive grid with staggered animations, game cards
- **Mock API Layer**: HTTP interceptor with simulated latency
- **i18n**: ngx-translate with 5 languages (EN, IT, FR, ES, PT)
- **Loading States**: Skeleton loader while data fetches
- **Error/Empty States**: Graceful error handling

### Coming Soon

- Authentication system (Guest/Username/Google)
- User settings and avatar customization
- Dragon Ball game integration
- Leaderboards and achievements

## i18n (Internationalization)

The application supports multiple languages. Users can switch languages using the language switcher in the navigation bar.

### Supported Languages

- 🇬🇧 English (en) - Default
- 🇮🇹 Italiano (it)
- 🇫🇷 Français (fr)
- 🇪🇸 Español (es)
- 🇵🇹 Português (pt)

### Adding a New Language

1. Create a new translation file: `apps/frenzydle/src/assets/i18n/{lang}.json`
2. Copy the structure from `en.json`
3. Translate all keys
4. Add the language to `SUPPORTED_LANGUAGES` in `libs/shared/data/src/lib/models/game.models.ts`

## Mock API

The application uses HTTP interceptors for mock API responses during development.

### Enabling Mock Mode

Mocks are enabled by default in development (`environment.useMocks: true`).

### Simulating Errors

Set `environment.simulateError: true` in `environment.ts` to test error states.

### Available Endpoints

- `GET /api/games` - List all games
- `GET /api/games/:id` - Get game details
- `GET /api/games/:id/daily-status` - Get user's daily status for a game

## License

Private project - All rights reserved.