## Step 2 — Homepage (Mocked, Styled, Animated)

Build the full homepage for FrenzyDle, applying the complete design system and all animations.
All data must come from mocked HTTP interceptors. No hardcoded data in components.

---

### Hero Section

- App name "FrenzyDle" as the logo, styled with a bold, playful font (Google Fonts — suggest Fredoka One or Nunito ExtraBold). Apply a pastel gradient to the text (CSS background-clip trick).
- Animation sequence on load:
    1. Logo fades in + scales from 0.8 → 1.0 (ease-out, ~600ms)
    2. Once logo is in, subtitle typewriters in character by character (~40ms per char)
- Subtitle text (you decide something captivating, quiz/game themed, keep it short — one punchy line)
- Entire hero section vertically centered, takes ~40vh

---

### Navigation Bar

Build the full persistent nav bar (shared UI component, goes in libs/shared/ui):
- Left: FrenzyDle logo/wordmark (same styled font, smaller) — links to /
- Center (desktop) / hidden (mobile): main nav links (Home only for now, others as placeholders)
- Right: language switcher (globe icon + dropdown: EN, IT, FR, ES, PT) + user avatar circle (placeholder pixel art for now — Guest state)
- Mobile: hamburger menu that slides in a drawer
- Sticky on scroll with a subtle frosted-glass / soft shadow effect (Tailwind backdrop-blur)
- Nav bar must be its own standalone component with a Storybook story showing: default (guest), logged-in, and mobile states

---

### Game Grid

Layout: responsive CSS grid
- 1 col on mobile, 2 cols on tablet, 3–4 cols on desktop
- Section title above the grid: "Today's Games" (or translated equivalent)
- Animate cards in with a staggered fade-up on page load (each card delays by index * 80ms)

Each game card (standalone component, libs/shared/ui or libs/games/dragonball/ui as appropriate) must display:
- Game thumbnail / illustration (use a generated SVG placeholder themed to the game — Dragon Ball: orange/gold tones)
- Game name and a one-line description
- Daily streak (e.g. "🔥 3 day streak") — from mock data
- Attempts today (e.g. "2/6 attempts") — from mock data
- "Completed today" badge (green checkmark overlay) if the daily puzzle is done — from mock data
- Countdown timer to next daily reset (real countdown — calculate from midnight UTC)
- CTA button: "Play" (active games) or "Coming Soon" (locked, greyed out, no hover effect)
- Hover state: card lifts slightly (translate-y + shadow), thumbnail has a subtle zoom

Dragon Ball card: fully active, links to /games/dragonball (route can be a placeholder page for now)
Add at least 2 "Coming Soon" cards (e.g. "Naruto", "One Piece") — locked state

---

### Mock API Layer

Define and implement the following endpoints via Angular HTTP interceptors.
All mocks live in a dedicated mock-interceptor service. The `useMocks` flag in environment.ts controls whether interceptors activate.
Simulate realistic latency (400–700ms) using a delay operator.

Endpoints to mock for the homepage:

GET /api/games
→ Returns list of all games with: id, name, description, thumbnailUrl, isActive, theme { primaryColor, secondaryColor }

GET /api/games/:id/daily-status
→ Returns for the current user+game: streakCount, attemptsUsed, maxAttempts, isCompletedToday, nextResetAt (ISO timestamp)

Document ALL of these in DOCUMENTATION.md under a section called "BFF API Contract", including request/response shapes as TypeScript interfaces. Even endpoints not yet needed (auth, user profile, leaderboard, achievements) should be stubbed here as forward-looking spec.

---

### i18n

Wire up Angular i18n (or ngx-translate — choose the most practical for this setup):
- All visible strings on the homepage and nav must be translatable
- Default: English
- Add translation keys for: IT, FR, ES, PT (use reasonable auto-translations for now, mark with a TODO comment so they can be reviewed)
- Language switcher in nav must actually switch the active language and persist the choice to localStorage

---

### Loading & Error States

- Skeleton loader for the game grid while the mock API responds (card-shaped pulsing placeholder, Tailwind animate-pulse)
- Error state if the games endpoint "fails" — add a `simulateError: boolean` flag in the mock for testing purposes
- Empty state if no games are returned

---

### Storybook

Every new component must have a story:
- NavBar: default (guest), logged-in, mobile viewport
- GameCard: active (not completed), active (completed today), coming-soon, loading skeleton
- HeroSection: default

---

### Tests & E2E

- Unit test coverage ≥ 85% across all new components and services — run `yarn test --coverage` and confirm
- Cypress e2e must cover:
    - Homepage loads and hero animation completes
    - Game grid renders correct number of cards from mock
    - Dragon Ball card shows correct mock data (streak, attempts, countdown)
    - "Coming Soon" cards are non-interactive
    - Language switcher changes visible text and persists on reload
    - Nav bar renders correctly and hamburger works on mobile viewport
    - Skeleton loader appears before mock data resolves
    - Error state renders when mock returns error

---

### Documentation

Update README.md:
- How to run the app
- How the language switcher works
- How to navigate to the game (placeholder)

Update DOCUMENTATION.md:
- Full BFF API Contract section (all endpoints, TypeScript interfaces)
- How to add a new game card to the grid
- How to add a new translation key
- How the mock interceptor works and how to toggle mocks off
- NX project graph overview (which lib owns what)

---

### Deliverable Checklist (before stopping)
- [ ] Hero section animates correctly on load
- [ ] Nav bar is fully functional (lang switcher, avatar, mobile drawer)
- [ ] Game grid loads from mock API with skeleton → data transition
- [ ] All card data (streak, attempts, completed badge, countdown) is driven by mock API
- [ ] i18n works and persists
- [ ] Coverage ≥ 85%
- [ ] All Cypress e2e tests pass
- [ ] Storybook has stories for every new component
- [ ] README.md and DOCUMENTATION.md updated

When all boxes are checked, stop and wait for explicit approval before committing.