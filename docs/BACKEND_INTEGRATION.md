# Backend Integration Guide - Authentication API

This document describes all authentication-related API endpoints that the frontend expects. The backend must implement these endpoints with the exact request/response formats specified below.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [CSRF Protection](#csrf-protection)
3. [Session Management](#session-management)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Security Considerations](#security-considerations)

---

## Authentication Flow

### User Journey

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
│  4a. LOGIN (existing user):                                         │
│      POST /api/auth/login { email, password }                       │
│                                                                      │
│  4b. CONVERT (guest → registered):                                  │
│      POST /api/auth/convert { email, password, displayName }        │
│                                                                      │
│  4c. REGISTER (new user):                                          │
│      POST /api/auth/register { email, password, displayName }       │
│                                                                      │
│                    GOOGLE SIGN-IN                                    │
│  5. POST /api/auth/google { idToken }                               │
│     (Backend validates Google ID token)                             │
│                                                                      │
│                        LOGOUT                                        │
│  6. POST /api/auth/logout → clears session, returns success         │
│     Frontend then creates new guest session                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## CSRF Protection

All mutating requests (POST, PUT, DELETE, PATCH) must include a CSRF token.

### CSRF Token Flow

1. Frontend calls `GET /api/auth/csrf` on app initialization
2. Backend returns a CSRF token (stored in httpOnly cookie + returned in response)
3. Frontend includes `X-CSRF-Token` header in all mutating requests

### CSRF Token Requirements

- Token should be cryptographically secure random string (32+ characters)
- Token should have an expiration time (recommended: 1 hour)
- Token should be tied to the session
- Backend should validate token matches session

---

## Session Management

### Session Requirements

- **NO localStorage for tokens** - Frontend stores auth state in memory only
- Sessions must be managed server-side via httpOnly cookies
- Session cookie should be:
  - `httpOnly: true`
  - `secure: true` (production)
  - `sameSite: 'strict'` or `'lax'`
  - Path: `/`

### Guest Sessions

- Created automatically when no session exists
- Guest users have:
  - Unique `id` (UUID)
  - `displayName`: `Guest#XXXX` (random 4 digits)
  - `isGuest: true`
  - `email: null`
- Guest sessions can be converted to registered accounts
- When converted, the guest's game history is preserved

---

## API Endpoints

### Common Response Format

All responses follow this structure:

```typescript
interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
  timestamp?: string;
}
```

### Error Response Format

```typescript
interface ErrorResponse {
  message: string;
  success: false;
  code?: string;      // Error code for frontend i18n
  details?: unknown;  // Additional error details
}
```

---

### 1. GET /api/auth/csrf

Get CSRF token for mutating requests.

**Request:**
```
GET /api/auth/csrf
```

**Response (200):**
```json
{
  "data": {
    "token": "a1b2c3d4e5f6g7h8i9j0...",
    "expiresAt": "2024-01-01T13:00:00.000Z"
  },
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Headers:**
- Set-Cookie: `csrf_token=<token>; Path=/; HttpOnly; Secure; SameSite=Strict`

---

### 2. GET /api/auth/me

Get current authenticated user. Called on app initialization.

**Request:**
```
GET /api/auth/me
Cookie: session=<session_cookie>
```

**Response (200 - User Authenticated):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "displayName": "Player123",
      "email": "player@example.com",
      "isGuest": false,
      "avatarUrl": "https://example.com/avatars/player123.png",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "success": true
}
```

**Response (401 - Not Authenticated):**
```json
{
  "message": "No active session",
  "success": false
}
```

**Status Codes:**
- `200`: User is authenticated, returns user profile
- `401`: No active session, frontend will create guest session

---

### 3. POST /api/auth/guest

Create a new guest session. Called when `GET /api/auth/me` returns 401.

**Request:**
```
POST /api/auth/guest
X-CSRF-Token: <csrf_token>
Cookie: csrf_token=<csrf_token>
```

**Request Body:** (empty)
```json
{}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "displayName": "Guest#4728",
      "email": null,
      "isGuest": true,
      "avatarUrl": null,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "success": true
}
```

**Headers:**
- Set-Cookie: `session=<session_cookie>; Path=/; HttpOnly; Secure; SameSite=Lax`

**Status Codes:**
- `200`: Guest session created successfully
- `500`: Server error

---

### 4. POST /api/auth/login

Authenticate existing user with email and password.

**Request:**
```
POST /api/auth/login
Content-Type: application/json
X-CSRF-Token: <csrf_token>
```

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "user_password"
}
```

**Response (200 - Success):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "displayName": "Player123",
      "email": "player@example.com",
      "isGuest": false,
      "avatarUrl": "https://example.com/avatars/player123.png",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "success": true
}
```

**Response (401 - Invalid Credentials):**
```json
{
  "message": "Invalid email or password",
  "success": false,
  "code": "INVALID_CREDENTIALS"
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Invalid request body
- `401`: Invalid credentials
- `429`: Too many attempts (rate limiting)

---

### 5. POST /api/auth/register

Create a new user account.

**Request:**
```
POST /api/auth/register
Content-Type: application/json
X-CSRF-Token: <csrf_token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "secure_password",
  "displayName": "NewPlayer"
}
```

**Validation Rules:**
- `email`: Valid email format, max 255 characters
- `password`: Minimum 8 characters, at least 1 number
- `displayName`: 2-24 characters, alphanumeric + underscores

**Response (200 - Success):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "displayName": "NewPlayer",
      "email": "newuser@example.com",
      "isGuest": false,
      "avatarUrl": null,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "success": true
}
```

**Response (409 - Email Exists):**
```json
{
  "message": "Email already registered",
  "success": false,
  "code": "EMAIL_EXISTS"
}
```

**Status Codes:**
- `200`: Registration successful
- `400`: Validation error
- `409`: Email already exists

---

### 6. POST /api/auth/convert

Convert a guest account to a registered account. Preserves game history and stats.

**Request:**
```
POST /api/auth/convert
Content-Type: application/json
X-CSRF-Token: <csrf_token>
Cookie: session=<guest_session>
```

**Request Body:**
```json
{
  "email": "converted@example.com",
  "password": "secure_password",
  "displayName": "ConvertedPlayer"
}
```

**Note:** `displayName` is optional if guest already has a display name they want to keep.

**Response (200 - Success):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "displayName": "ConvertedPlayer",
      "email": "converted@example.com",
      "isGuest": false,
      "avatarUrl": null,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "success": true
}
```

**Response (409 - Email Exists):**
```json
{
  "message": "Email already registered",
  "success": false,
  "code": "EMAIL_EXISTS"
}
```

**Response (400 - Not a Guest):**
```json
{
  "message": "Current session is not a guest account",
  "success": false,
  "code": "NOT_GUEST"
}
```

**Status Codes:**
- `200`: Conversion successful
- `400`: Not a guest account
- `401`: Not authenticated
- `409`: Email already exists

---

### 7. POST /api/auth/google

Authenticate via Google OAuth.

**Request:**
```
POST /api/auth/google
Content-Type: application/json
X-CSRF-Token: <csrf_token>
```

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Backend Must:**
1. Validate Google ID token using Google's public keys
2. Extract user info (email, name, picture)
3. Create or update user account
4. Return user profile

**Response (200 - Success):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "displayName": "Google User",
      "email": "googleuser@gmail.com",
      "isGuest": false,
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "success": true
}
```

**Response (401 - Invalid Token):**
```json
{
  "message": "Invalid Google token",
  "success": false,
  "code": "INVALID_GOOGLE_TOKEN"
}
```

**Status Codes:**
- `200`: Authentication successful
- `400`: Invalid request body
- `401`: Invalid or expired Google token

---

### 8. POST /api/auth/logout

Logout current user and invalidate session.

**Request:**
```
POST /api/auth/logout
X-CSRF-Token: <csrf_token>
Cookie: session=<session_cookie>
```

**Request Body:** (empty)
```json
{}
```

**Response (200):**
```json
{
  "data": {
    "success": true
  },
  "success": true
}
```

**Note:** Frontend will immediately create a new guest session after logout.

**Status Codes:**
- `200`: Logout successful
- `401`: Not authenticated (still return 200 for idempotency)

---

### 9. POST /api/auth/check-email

Check if an email is already registered. Used to determine login flow.

**Request:**
```
POST /api/auth/check-email
Content-Type: application/json
```

**Note:** This endpoint does NOT require CSRF token (used before authentication).

**Request Body:**
```json
{
  "email": "check@example.com"
}
```

**Response (200):**
```json
{
  "data": {
    "exists": true,
    "suggestedAction": "login"
  },
  "success": true
}
```

**suggestedAction Values:**
- `"login"`: Email exists, user should login
- `"convert"`: Email doesn't exist, current user is guest, suggest converting account
- `"register"`: Email doesn't exist, current user is not guest (or no session), suggest registering

**Response Logic:**

| Email Exists | Current Session | suggestedAction |
|-------------|-----------------|-----------------|
| Yes         | Any             | `"login"`       |
| No          | Guest           | `"convert"`     |
| No          | None/Registered | `"register"`    |

**Status Codes:**
- `200`: Check successful
- `400`: Invalid email format

---

## Error Handling

### Error Response Structure

```typescript
interface ErrorResponse {
  message: string;      // Human-readable error message
  success: false;
  code?: string;        // Machine-readable error code for i18n
  details?: unknown;    // Optional validation details
}
```

### Error Codes for Frontend i18n

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | Wrong email/password | 401 |
| `EMAIL_EXISTS` | Email already registered | 409 |
| `INVALID_GOOGLE_TOKEN` | Google token validation failed | 401 |
| `NOT_GUEST` | Cannot convert non-guest account | 400 |
| `SESSION_EXPIRED` | Session has expired | 401 |
| `CSRF_INVALID` | CSRF token validation failed | 403 |
| `RATE_LIMITED` | Too many requests | 429 |
| `VALIDATION_ERROR` | Request validation failed | 400 |

---

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least 1 number
- Backend should validate and return clear error messages

### Rate Limiting
Implement rate limiting on these endpoints:
- `POST /api/auth/login` - Max 5 attempts per 15 minutes per IP
- `POST /api/auth/register` - Max 3 attempts per hour per IP
- `POST /api/auth/check-email` - Max 20 requests per hour per IP

### Session Security
- Sessions should have reasonable expiration (e.g., 30 days inactive)
- Sessions should be invalidated on password change
- Consider implementing refresh tokens for long sessions

### CORS Configuration
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-CSRF-Token
Access-Control-Allow-Credentials: true
```

### Headers
All responses should include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Data Types

### UserProfile

```typescript
interface UserProfile {
  id: string;           // UUID
  displayName: string;  // 2-24 characters
  email: string | null; // null for guests
  isGuest: boolean;
  avatarUrl: string | null;
  createdAt: string;     // ISO 8601 timestamp
}
```

### CheckEmailResponse

```typescript
interface CheckEmailResponse {
  exists: boolean;
  suggestedAction: 'login' | 'convert' | 'register';
}
```

---

## Testing Credentials

For development/testing purposes, the frontend expects:

**Test Account:**
- Email: `test@frenzydle.com`
- Password: Any password ≥8 characters
- Should simulate successful login

**Error Simulation:**
- Email: `error@frenzydle.com`
- Should return 500 error

---

## Toggling Mock Mode

The frontend can run in two modes:

### Mock Mode (Development)
Set in `apps/frenzydle/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  useMocks: true,        // ← Enable mock interceptor
  simulateError: false,  // Set to true to test error states
  apiBaseUrl: '/api',
};
```

When `useMocks: true`:
- All API calls are intercepted by the mock interceptor
- No real backend required
- In-memory session state (resets on page refresh)
- Test credentials: `test@frenzydle.com` / any password ≥8 chars

### Production Mode (Real Backend)
Set in `apps/frenzydle/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  useMocks: false,  // ← Disable mocks, use real backend
  apiBaseUrl: '/api',
};
```

When `useMocks: false`:
- All API calls go to the real backend
- Backend must implement all endpoints documented below
- Sessions managed via httpOnly cookies
- CSRF protection required

### Switching Modes

1. **Development with mocks:** Use default `environment.ts`
2. **Development with real backend:** Set `useMocks: false` in `environment.ts`
3. **Production build:** Uses `environment.prod.ts` automatically

```bash
# Development build (uses environment.ts)
npx nx build frenzydle

# Production build (uses environment.prod.ts)
npx nx build frenzydle --configuration=production
```

---

## Environment Configuration

Frontend expects these environment variables:

```typescript
interface Environment {
  production: boolean;
  apiBaseUrl: string;      // e.g., 'https://api.frenzydle.com'
  useMocks: boolean;       // false in production
}
```

In production, `useMocks` should be `false`, causing the frontend to make real API calls instead of using mock data.

### Switching Between Mock and Real Backend

The frontend uses the `useMocks` flag to determine whether to use mock data or make real API calls:

**Development (with mocks):**
```typescript
// apps/frenzydle/src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: '/api',
  useMocks: true,  // Uses mock interceptor
};
```

**Production (real backend):**
```typescript
// apps/frenzydle/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.frenzydle.com',
  useMocks: false,  // Makes real API calls
};
```

When `useMocks: false`:
1. The `mockInterceptor` passes requests through to the real backend
2. The `csrfInterceptor` fetches real CSRF tokens from `/api/auth/csrf`
3. All auth endpoints must be implemented by the backend

---

## Questions?

Contact the frontend team for clarification on any endpoints or data formats.