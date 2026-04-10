## Step 4 — User Page (No Avatar Customisation)

Build the complete /user page with three tabs: Stats, Achievements, and Settings.
All data is mocked via interceptors. No avatar customisation yet (Step 5).
Guest users see a teaser version of the page with a sign-in CTA.

---

### Page Layout

Tabbed layout with three tabs: Stats | Achievements | Settings
- Desktop: tabs sit below a user profile header, full width
- Mobile: tabs are sticky at the top, scrollable content below
- Active tab has a clear visual indicator (underline + accent color)
- Tab switching is animated (content fades in, ~150ms)
- Each tab is a standalone routed component:
  /user → redirects to /user/stats (default)
  /user/stats
  /user/achievements
  /user/settings

#### User Profile Header (visible on all tabs)
- Large avatar circle (placeholder pixel art for now — Step 5 will replace)
- displayName (editable inline — click to edit, confirm on Enter or blur)
- Email address (read only, greyed)
- "Guest" badge if isGuest (shouldn't reach this page as guest — see below)
- Subtle animated entrance on page load (fade + slide up)

---

### Guest Teaser State

Guest users CAN reach /user (remove the hard block from Step 3 guard).
Update the authGuard to allow guests through with a flag instead of blocking.

Guest sees:
- Profile header with their Guest#XXXX name and default avatar
- Stats tab: blurred/frosted stat cards beneath a centered overlay:
  "Sign in to track your progress"
    + "Create account" button (opens auth modal)
    + "Maybe later" link (navigates back to home)
- Achievements tab: same blur overlay pattern
- Settings tab: fully visible (log out is valid for guests too)

Logged-in users see everything without overlays.

---

### Tab 1 — Stats

#### Summary Cards (4 cards in a responsive grid, 2x2 on mobile, 4x1 on desktop)
Each card is animated (count-up animation on first render):
- Total Games Played
- Win Rate (shown as % with a small circular progress ring)
- Current Streak / Best Streak (two values in one card, with flame icon)
- Average Attempts per Game (e.g. "3.4 / 6")

#### Activity Chart
- Line chart showing games played per day over the last 30 days
- X axis: dates, Y axis: games played count
- Use Chart.js (already available in the project) or a lightweight SVG approach
- Pastel color scheme matching the app theme
- Responsive — full width, fixed height (~220px)
- Show per-game filter dropdown above the chart (All Games / Dragon Ball / etc.)
  populated from mock game list

#### Mock API

GET /api/user/stats
response:
{
totalGamesPlayed: number;
winRate: number;          // 0–100
currentStreak: number;
bestStreak: number;
avgAttempts: number;      // e.g. 3.4
activityByDay: {
date: string;           // ISO date "2026-03-15"
gamesPlayed: number;
}[];
perGame: {
gameId: string;
gameName: string;
totalPlayed: number;
winRate: number;
currentStreak: number;
bestStreak: number;
avgAttempts: number;
}[];
}

Mock with 30 days of realistic activity data (varied, not all the same value).
Simulate a returning user with a streak of 5, win rate ~72%.

---

### Tab 2 — Achievements

#### Layout
Vertical list of achievement items. Each item:
- Icon (SVG, themed per achievement — use simple geometric shapes / emoji-like SVGs)
- Achievement name + description
- Unlock condition text (e.g. "Play 10 games in a row")
- Progress bar showing current progress toward unlock (e.g. 6/10)
- "Unlocked" badge + unlock date if completed (green, with a subtle shimmer animation)
- Locked items are slightly muted but fully readable (no blur — progress bars show)

Group achievements into categories with section headers:
- 🎮 Playing (streak-based, games played)
- 🏆 Performance (win rate, perfect games)
- 🎨 Customisation (avatar-related — show as locked, will unlock in Step 5)

Clicking an unlocked achievement shows a small celebration toast notification
(confetti burst + "Achievement unlocked!" message, auto-dismisses in 2s).

#### Mock API

GET /api/achievements
response: Achievement[]

GET /api/achievements/user
response: UserAchievement[]

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'playing' | 'performance' | 'customisation';
  unlockCondition: string;
  maxProgress: number;
  iconType: string;       // used to pick SVG icon
  unlocksAvatarItem?: string; // for Step 5 wiring
}

interface UserAchievement {
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;  // ISO timestamp
}
```

Mock with at least 12 achievements across the three categories.
Make 4 of them unlocked (with realistic dates), the rest at varying progress levels.

---

### Tab 3 — Settings

#### Sections

**Account**
- Display name: inline editable field (same as profile header — keep in sync via signal)
- Email: read only
- Change password: button → opens a small inline form (current password +
  new password + confirm). Calls mock PUT /api/user/password. Always succeeds in mock.
- Connected accounts: shows Google connected status (mock: not connected).
  "Connect Google" button → mock flow, always succeeds.

**Preferences**
- Language selector (same languages as nav switcher — keep in sync)
- Theme toggle placeholder (light/dark — not implemented yet, just the UI toggle
  with a "coming soon" tooltip)

**Danger Zone**
- "Delete all my data" button — red, requires typing "DELETE" in a confirmation
  input inside a modal before proceeding. Calls DELETE /api/user/data.
  On success: logout → new guest session → redirect to home.
- "Log out" button — calls POST /api/auth/logout → new guest session → home.
  Show a brief "See you soon!" toast before redirecting.

#### Mock API (new endpoints)

PUT /api/user/profile
body: { displayName?: string }
response: { user: UserProfile }
mock: always succeed, update interceptor in-memory user state

PUT /api/user/password
body: { currentPassword: string, newPassword: string }
response: { success: boolean }
mock: always succeed

DELETE /api/user/data
response: { success: boolean }
mock: always succeed, clear interceptor auth state

---

### State Management

- Create a UserProfileService in libs/shared/data using signals:

```typescript
// Signals
userStats = signal<UserStats | null>(null);
achievements = signal<Achievement[]>([]);
userAchievements = signal<UserAchievement[]>([]);

// Computed
unlockedAchievements = computed(() =>
  this.userAchievements().filter(a => a.isUnlocked)
);

// Methods
loadStats(): Promise<void>
loadAchievements(): Promise<void>
updateDisplayName(name: string): Promise<void>
  // updates both UserProfileService and AuthService currentUser signal
deleteAccount(): Promise<void>
  // calls DELETE /api/user/data → auth logout flow
```

- Display name changes must stay in sync between:
  the profile header, the Settings tab input, and the nav bar
  All three consume the same AuthService.currentUser signal — no duplication.

---

### Storybook Stories

UserProfileHeaderComponent:
- logged-in
- guest

StatsTabComponent:
- loaded (with mock data)
- loading (skeleton state)
- guest-teaser (blurred overlay)

AchievementsTabComponent:
- loaded (mix of locked/unlocked)
- loading
- guest-teaser

AchievementItemComponent:
- unlocked
- in-progress
- locked (0 progress)

SettingsTabComponent:
- logged-in
- guest (log out only, no account section)

ConfirmDeleteModalComponent:
- default
- typed-correctly (delete button enabled)

---

### Tests & E2E

Unit test coverage ≥ 85%. Run yarn test --coverage and confirm before stopping.

Cypress e2e must cover:

Guest teaser:
- Guest navigates to /user → sees teaser overlay on Stats and Achievements tabs
- "Create account" button in teaser opens auth modal
- Settings tab fully accessible to guest
- Guest can log out from Settings tab

Stats tab:
- Summary cards render with correct mock values
- Count-up animation fires on load (check final value)
- Line chart renders (canvas/svg element present)
- Per-game filter changes chart data

Achievements tab:
- All 12 achievements render
- Unlocked achievements show badge + date
- Progress bars reflect mock progress values
- Clicking unlocked achievement shows toast

Settings tab:
- Display name edit: click → input appears → type → Enter → nav bar updates
- Change password form: submit → success feedback
- Language change in settings → nav switcher reflects it
- "Delete all my data": button disabled until "DELETE" typed → confirm →
  logout → redirected to home → new guest session in nav
- Log out: toast shown → redirect home → guest session in nav

Tab navigation:
- All three tabs navigable, URL updates correctly
- Refreshing on /user/achievements stays on achievements tab

---

### Documentation

Update DOCUMENTATION.md:
- New mock endpoints (stats, achievements, user profile updates)
- UserProfileService signal API
- How display name sync works across components
- Achievement category structure and how to add new achievements
- Guest teaser pattern — how to apply it to future pages

Update README.md:
- How to navigate the user page
- Mock credentials reminder
- How to test delete account flow

---

### Deliverable Checklist
- [ ] /user defaults to /user/stats, all three tab routes work
- [ ] Guest sees teaser on Stats + Achievements, full Settings tab
- [ ] Profile header shows correct user info, display name editable
- [ ] Stats cards render with count-up animation, correct mock values
- [ ] Line chart renders with 30-day activity data and per-game filter
- [ ] Achievements list: 12 items, correct locked/unlocked states, progress bars
- [ ] Unlocked achievement click shows toast
- [ ] Settings: display name sync works across nav + header + settings
- [ ] Delete data flow: confirmation input → success → guest session → home
- [ ] Log out flow: toast → home → new guest session
- [ ] All Storybook stories present
- [ ] Coverage ≥ 85%
- [ ] All Cypress e2e tests pass
- [ ] DOCUMENTATION.md and README.md updated

When all boxes are checked, stop and wait for explicit approval before committing.