## Step 3 — Authentication System (Fully Mocked)

Implement the complete authentication system. All auth is mocked via interceptors.
No real backend. No localStorage for tokens — ever.
Auth state lives in memory (Angular signals only).

---

### Core Architecture Decisions

#### Token Storage
- JWTs are NEVER stored in the frontend (not localStorage, not sessionStorage, not cookies)
- In production, the BE will set httpOnly; Secure; SameSite=Strict cookies
- In mock mode: the interceptor simply returns the user object and the AuthService
  stores it in a signal — no token handling on the frontend at all
- On page load: call GET /api/auth/me — if it returns a user, session is active;
  if it returns 401, init as guest
- The frontend never reads, stores, or decodes a JWT

#### CSRF Scaffold
- Add an HttpInterceptor (CsrfInterceptor) that reads an X-CSRF-Token from a
  meta tag or a GET /api/auth/csrf endpoint and attaches it as a header to every
  mutating request (POST, PUT, DELETE, PATCH)
- In mock mode: the interceptor returns a fake static token "mock-csrf-token"
- The header must be present on all mutating calls even in mocks — BE agent will
  plug in real logic without frontend changes
- Document the CSRF pattern in DOCUMENTATION.md

#### Guest Session
- On first visit: call POST /api/auth/guest
- Mock returns: { user: { id: uuid, displayName: "Guest#XXXX", isGuest: true } }
- Guest#XXXX is generated server-side in the mock (not in Angular code)
- Generate a random 4-digit number inside the mock interceptor response only
- Store resulting user object in AuthService signal — nothing else
- Guest identity persists across refreshes via GET /api/auth/me returning the
  same guest user (mock: always return the last user stored in the interceptor's
  in-memory state for the session)

---

### AuthService (libs/shared/data)

Use Angular signals exclusively. No RxJS unless unavoidable.

```typescript
// Signals
currentUser = signal<UserProfile | null>(null);
isGuest = computed(() => this.currentUser()?.isGuest ?? true);
isLoggedIn = computed(() => !this.isGuest());

// Initialisation (called via APP_INITIALIZER)
async initSession(): Promise<void>
  // calls GET /api/auth/me
  // if 200 → set currentUser signal
  // if 401 → call POST /api/auth/guest → set currentUser signal

// Auth methods
async loginWithGoogle(): Promise<void>
async login(email: string, password: string): Promise<void>
async checkEmail(email: string): Promise<{ exists: boolean }>
async convertGuest(email: string, password: string, displayName?: string): Promise<void>
  // used when current user isGuest — calls POST /api/auth/convert
async register(email: string, password: string, displayName: string): Promise<void>
  // used when no guest session exists — calls POST /api/auth/register
async logout(): Promise<void>
  // calls POST /api/auth/logout → resets signal → calls initSession() to
  // create a new guest session automatically
```

AuthService must be initialised before first render via APP_INITIALIZER.
The app must never render in an uninitialised auth state.

---

### Mock API Endpoints

All mocked in the interceptor. Simulate 400–700ms latency.
Interceptor maintains a simple in-memory state object for the session:
{ currentUser: UserProfile | null }

GET /api/auth/csrf
response: { token: "mock-csrf-token" }

GET /api/auth/me
response (if guest session active): { user: GuestProfile }
response (if logged in): { user: UserProfile }
response (cold start / first ever visit): 401 → triggers guest init

POST /api/auth/guest
response: { user: { id: uuid(), displayName: "Guest#" + randomDigits(), isGuest: true } }
side effect: store in interceptor in-memory state

POST /api/auth/check-email
body: { email: string }
response: { exists: boolean }
mock: return exists: true for "test@frenzydle.com", false for all others

POST /api/auth/login
body: { email: string, password: string }
response: { user: UserProfile }
mock: accept any password for "test@frenzydle.com"
mock UserProfile: { id: "user-001", displayName: "Tester", email: "test@frenzydle.com", isGuest: false, avatarData: null, createdAt: <iso> }
side effect: update interceptor in-memory state

POST /api/auth/convert
body: { email: string, password: string, displayName?: string }
used when: current user isGuest === true
response: { user: UserProfile }
mock: always succeed, preserve the existing guest UUID, set isGuest: false
side effect: update interceptor in-memory state
note: no UI difference from register — same success flow

POST /api/auth/register
body: { email: string, password: string, displayName: string }
used when: no guest session (edge case — should rarely happen)
response: { user: UserProfile }
mock: always succeed, generate new UUID
side effect: update interceptor in-memory state

POST /api/auth/google
body: { mockToken: "mock-google-token" }
response: { user: { id: "google-001", displayName: "Mario Rossi", email: "mario.rossi@gmail.com", isGuest: false, avatarData: null, createdAt: <iso> } }
side effect: update interceptor in-memory state

POST /api/auth/logout
response: { success: true }
side effect: clear interceptor in-memory state → AuthService calls initSession()
which creates a fresh new guest session automatically

---

### TypeScript Interfaces (add to libs/shared/data models)

```typescript
interface UserProfile {
  id: string;
  displayName: string;
  email: string | null;       // null for guests
  isGuest: boolean;
  avatarData: AvatarData | null;  // populated in Step 5
  createdAt: string;          // ISO timestamp
}

interface AuthState {
  user: UserProfile;
}
```

---

### Nav Bar Updates

Update NavBarComponent to consume AuthService signals reactively:

Guest state:
- Avatar circle: default placeholder, dashed border, muted tone
- Username: "Guest#XXXX" in muted style
- "Sign in" text button next to username → opens auth modal

Logged-in state:
- Avatar circle: solid border, accent color
- Username: displayName
- No "Sign in" button
- Clicking avatar → navigates to /user

Both states: avatar click area must be clearly tappable on mobile (min 44x44px).
Nav must update instantly when currentUser signal changes — no page reload.

---

### Auth Modal

Centered overlay, backdrop blur, animated entrance (scale 0.92→1 + fade, 200ms ease-out).
Close via: X button, backdrop click, Escape key.
Modal is a standalone component in libs/shared/feature.

#### Step 1 — Method selection
- Google button (prominent)
- Divider "or continue with email"
- Email input + "Continue" CTA
- Below form: "Continue as Guest" link → closes modal, no action

#### Step 2 — Smart email form
On "Continue" clicked:
1. Call POST /api/auth/check-email
2. Show inline loader on the Continue button during call
   3a. exists: true → show password field only. Subtitle: "Welcome back!"
   3b. exists: false and currentUser.isGuest → show password + display name fields.
   Call POST /api/auth/convert on submit. Subtitle: "Create your account"
   3c. exists: false and not guest → show password + display name.
   Call POST /api/auth/register. Subtitle: "Create your account"
   Back arrow returns to Step 1

#### Step 3 — Success
- Animated checkmark (SVG draw animation, 600ms)
- Modal auto-closes after 800ms
- Nav updates instantly via signal

#### Google mock flow
- Click Google button → show "Connecting to Google..." loader (700ms)
- Call POST /api/auth/google
- Proceed to Step 3 success

#### Validation (inline, no alert boxes)
- Email: valid format before enabling Continue
- Password: min 8 chars, at least 1 number
- Display name: min 2 chars, max 24 chars
- Confirm password field not needed — keep form minimal
- All error messages appear below the relevant field
- Continue/Submit button disabled while validation fails or request is in flight

---

### Route Guard

Create a functional canActivate guard (libs/shared/data):

```typescript
export const authGuard = () => {
  const auth = inject(AuthService);
  const modal = inject(AuthModalService);
  if (auth.isLoggedIn()) return true;
  modal.open({ redirectAfterLogin: '/user' });
  return false;
};
```

- /user route uses this guard
- If guest visits /user directly: modal opens; after successful login: navigate to /user
- No redirect to /login — modal appears over current page

---

### Storybook Stories

AuthModalComponent:
- step1-default
- step1-email-filled
- step2-login (existing email)
- step2-register (new email, guest converting)
- step2-loading (email check in flight)
- step3-success
- google-loading

NavBarComponent (update existing stories):
- guest (default — no username yet, cold start)
- guest-with-username (Guest#4821)
- logged-in (real displayName)
- logged-in-mobile

---

### Tests & E2E

Unit test coverage ≥ 85%. Run yarn test --coverage and confirm before stopping.

Cypress e2e must cover:

Auth initialisation:
- On first visit, GET /api/auth/me returns 401 → POST /api/auth/guest fires →
  Guest#XXXX appears in nav
- On return visit (mock returns existing guest), same Guest#XXXX shown

Modal:
- "Sign in" button opens modal
- Escape key closes modal
- Backdrop click closes modal
- Google flow completes → nav updates → modal gone

Smart form:
- Known email (test@frenzydle.com) → password-only form shown
- Unknown email → register form shown
- Validation: short password shows error, disabled button
- Back arrow returns to Step 1

Login:
- Successful login → nav shows "Tester" → page unchanged

Convert (guest → account):
- As guest, register with new email → POST /api/auth/convert called (verify via
  interceptor spy or cy.intercept alias)
- Nav shows new displayName after success

Google:
- Google button → loading state visible → success → nav updates

Logout:
- Logout → nav returns to new Guest#XXXX (new guest session created)

Guard:
- Navigate to /user as guest → modal opens
- Complete login in modal → lands on /user

CSRF:
- Every POST/PUT/DELETE request carries X-CSRF-Token header (verify via
  cy.intercept inspecting request headers)

---

### Documentation

Update DOCUMENTATION.md:

- Auth flow diagram (ASCII):
  Cold start → GET /api/auth/me → 401 → POST /api/auth/guest → Guest session
  Sign in → check-email → login OR convert/register → Logged-in session
  Logout → POST /api/auth/logout → new guest session

- All new mock endpoints with full request/response TypeScript shapes
- AuthService signal API reference
- CSRF interceptor: how it works, what the BE agent needs to implement
- How mock in-memory auth state works and its limitations
- Guest → account conversion flow explanation
- Route guard usage

Update README.md:
- Mock credentials: test@frenzydle.com / any password ≥ 8 chars + 1 number
- How to test Google mock login
- How to test guest → account conversion

---

### Deliverable Checklist
- [ ] Cold start: guest session created via POST /api/auth/guest, shown in nav
- [ ] Return visit: GET /api/auth/me restores session, same guest shown
- [ ] "Sign in" opens modal, all close mechanisms work
- [ ] Smart form: email check routes correctly to login vs convert vs register
- [ ] Google mock flow works end to end
- [ ] Guest converting to account calls POST /api/auth/convert
- [ ] Nav updates reactively via signals on all auth state changes
- [ ] Logout creates a fresh new guest session automatically
- [ ] /user guard works — modal opens for guests, navigates after login
- [ ] CSRF header present on all mutating requests (verified in e2e)
- [ ] All Storybook stories present and correct
- [ ] Coverage ≥ 85%
- [ ] All Cypress e2e tests pass
- [ ] DOCUMENTATION.md and README.md updated

When all boxes are checked, stop and wait for explicit approval before committing.