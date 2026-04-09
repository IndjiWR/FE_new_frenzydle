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
# Development mode
npx nx serve frenzydle

# Or using npm scripts
npm start
```

The application will be available at `http://localhost:4200`.

### Running Tests

```bash
# Unit tests
npx nx test frenzydle

# Run tests with coverage
npx nx test frenzydle --coverage

# E2E tests
npx nx e2e frenzydle-e2e
```

### Building for Production

```bash
npx nx build frenzydle --configuration=production
```

## Project Structure

```
apps/
  frenzydle/              ← Main Angular application
  frenzydle-e2e/          ← E2E tests (Cypress)

libs/
  shared/
    ui/                   ← Shared UI components (buttons, modals, etc.)
    data/                 ← Shared services, models, interceptors
    feature/              ← Shared feature modules (auth, settings)
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
| `npx nx test frenzydle` | Run unit tests |
| `npx nx e2e frenzydle-e2e` | Run E2E tests |
| `npx nx storybook shared-ui` | Start Storybook for UI components |

## Tech Stack

- **Framework**: Angular (latest standalone components + signals)
- **Styling**: Tailwind CSS
- **Testing**: Jest (unit tests), Cypress (E2E)
- **Documentation**: Storybook
- **Monorepo**: NX

## Features

### Current (Step 1)

- ✅ NX Monorepo structure
- ✅ Angular application with routing
- ✅ Tailwind CSS configuration
- ✅ Jest test setup
- ✅ Cypress E2E setup
- ✅ Storybook configuration
- ✅ HTTP interceptor scaffold
- ✅ Environment configuration with mock support

### Coming Soon

- Homepage with game grid
- Authentication system (Guest/Username/Google)
- User settings and avatar customization
- Dragon Ball game integration

## License

Private project - All rights reserved.