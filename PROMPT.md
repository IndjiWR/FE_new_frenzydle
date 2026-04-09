You should build an Angular web application called FrenzyDle.

## Overview
FrenzyDle is a container platform for daily quiz games (Wordle/Gamedle-style). The platform comes first; games are plugged in later. The first game to be integrated (after the container is complete) will be Dragon Ball, featuring two modes: "Guess the Character" (text-based Wordle) and "Guess the Image" (silhouette/image reveal).

---

## Tech Stack
- Angular (latest stable, standalone components + signals throughout — no NgModules)
- Tailwind CSS
- Jest (unit tests)
- Storybook
- NX monorepo
- i18n: English (default), Italian, French, Spanish, Portuguese
- Cypress (e2e)

---

## NX Monorepo Structure
Use the following library architecture. Every game gets its own scoped libs:

apps/
frenzydle/              ← main Angular app

libs/
shared/
ui/                   ← shared dumb components (buttons, modals, avatar, nav...)
data/                 ← shared services, models, interceptors, auth state
feature/              ← shared feature modules (auth flow, user settings)
games/
dragonball/
ui/                 ← Dragon Ball specific components
data/               ← Dragon Ball specific services/models
feature/            ← Dragon Ball specific pages/smart components

Enforce NX project boundaries. No cross-game imports. Shared libs are the only cross-cutting concern.

---

## Auth & API Strategy
- ALL backend calls must be fully mocked (no real backend in this phase)
- Use Angular HTTP interceptors to intercept and mock every API call
- A proxy config (proxy.conf.json) should be set up for future BFF readiness
- environment.ts must have a `useMocks: boolean` flag to toggle mocks on/off
- When mocks are enabled (default: true), interceptors return realistic fake data with simulated latency (300–800ms)
- Define a clear BFF API contract in documentation.md covering every endpoint the app will eventually need (auth, user profile, game results, leaderboard, achievements, avatar)

---

## Workflow Rules
1. Delete all default NX-generated boilerplate (nx-welcome, etc.)
2. Every custom component must have a Storybook story
3. Test coverage must be ≥ 85% — run `yarn test --coverage` at the end of each step
4. Run Cypress e2e at the end of each step to verify all functionality
5. Mock every API call via interceptors; never call a real endpoint
6. Always update README.md (user-facing: how to run, how to navigate the app)
7. Always update DOCUMENTATION.md (developer-facing: project structure, how to run tests, how to use shared components, API contract, NX boundaries, environment config)
8. Only commit after: coverage ≥ 85% ✓, e2e passing ✓, and explicit user approval ✓
9. At the end of every step the app must be fully navigable and all tests must pass
10. After completing a step, stop and wait for the next detailed prompt

---

## Design System
- Style: clean pastel — soft background tones, rounded corners, playful typography, light and airy feel
- Highly animated and reactive: page transitions, micro-interactions on every button/card, smooth loaders
- Fully responsive (mobile-first)
- Tailwind utility classes only — no custom CSS unless unavoidable
- Color palette suggestion: lavender, mint, peach, sky blue — with one bold accent per game theme

---

## Content & Features

### Landing Page / Homepage
- Large animated logo fading in on load
- Captivating animated subtitle (typewriter or fade-in effect)
- Below: a grid/list of all available games (cards), each showing game name, theme, and a "Play" CTA
- For unreleased games, cards are shown as "Coming Soon" (locked/greyed)
- On first visit, user is auto-logged in as Guest

### Authentication
- Three login methods: Guest (auto) / Username + Password / Google (mocked OAuth flow)
- Auth state persisted in localStorage (with mock JWT token)
- User icon in nav = pixel art avatar (face only, circular crop)

### User Settings Page
- Log out
- Delete all user data (with confirmation modal)
- User stats dashboard: games played, win streaks, accuracy chart (use a simple chart lib or SVG)
- Achievements panel: grid of locked/unlocked achievement badges
- Avatar customization (medium complexity):
    - Pixel art editor (16x16 or 32x32 face)
    - Customizable: skin tone, hair style, hair color, eye color, expression, accessories (glasses, hats), unlockable items tied to achievements
    - Preview updates in real time
    - Save avatar to mock user profile

---

## Steps

### Step 1 — Project Setup & Base Routing
- Initialize NX monorepo with the library structure defined above
- Set up Angular app with routing (no styles yet, just shell routes)
- Configure Tailwind CSS
- Configure Jest
- Configure Cypress
- Configure Storybook
- Set up environment.ts with `useMocks: true`
- Set up HTTP interceptor scaffold (empty, ready to be filled)
- Set up proxy.conf.json
- Create empty README.md and DOCUMENTATION.md with placeholder sections
- Deliverable: app boots, routes exist (/, /user), no 404s, all configs working

### Step 2 — Homepage (Mocked)
- Build the animated landing page with logo, subtitle, and game grid
- Add one Dragon Ball game card (playable) and at least one "Coming Soon" card
- Implement the full mock API layer for homepage data (game list endpoint)
- Apply the full pastel design system and animations
- Think through and document in DOCUMENTATION.md every API call the homepage will eventually need
- Deliverable: beautiful, animated homepage; game grid renders from mocked API

### Step 3 — Login System
- Guest auto-login on first visit
- Username + password login/register form (mocked)
- Google login (mocked OAuth — button click → fake success)
- Auth state in localStorage with mock JWT
- Nav bar with user avatar icon and login/logout states
- Protected routes (user settings requires login)
- Deliverable: all three auth flows work, state persists across refresh

### Step 4 — User Page (No Avatar Customization Yet)
- Log out functionality
- Delete data (with confirmation modal, clears localStorage)
- Stats dashboard: games played, win rate, streak (mocked data, real chart)
- Achievements panel: grid of achievements, locked/unlocked states (mocked)
- Deliverable: full user page functional with mocked data

### Step 5 — Avatar Customization
- Pixel art avatar editor (face, 32x32 recommended)
- Layers: skin tone, hair style + color, eye color, expression, accessories
- Achievements unlock specific items (defined in mock data)
- Real-time preview
- Save to mock profile
- Avatar displays correctly in nav bar and user page
- Deliverable: fully working avatar system integrated across the app

---

## Important Notes
- Use standalone components and Angular signals everywhere — no NgModules, no RxJS where signals suffice
- Keep memory of completed steps and what's pending across the session
- Never leave a step in a broken state — if something can't be completed, flag it explicitly before stopping