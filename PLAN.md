# Daily Tracker App — Implementation Plan

A React demo app with auth (login / register / forgot password) and a post-login workspace containing a Dashboard, an Excel-style Activity Tracker, and a Money Calculator. No backend — all data lives in `localStorage`. The data layer is shaped so the future API swap is a one-file change.

---

## 1. Goals

- Working auth flow: register a new user, log in, "forgot password" reset (all client-side against `localStorage`).
- Persistent session: refreshing the page keeps the user signed in.
- Three feature pages reachable from a left sidebar after login:
  1. **Dashboard** — at-a-glance summary of today's data.
  2. **Activity Tracker** — spreadsheet-style editable rows.
  3. **Money Calculator** — income/expense ledger with live totals.
- Code organized so swapping `localStorage` for a real API touches one hook, not every component.

---

## 2. Tech Stack

| Concern        | Choice                                        |
| -------------- | --------------------------------------------- |
| Framework      | React 18 + Vite                               |
| Routing        | `react-router-dom` v6                         |
| State          | Local component state + custom hooks          |
| Persistence    | `localStorage` (wrapped by `useLocalStorage`) |
| Styling        | Plain CSS (`src/styles.css`)                  |
| Build / dev    | `npm run dev` / `npm run build`               |

Install once added: `npm install react-router-dom`.

---

## 3. Routing & Layout

Use `react-router-dom` with two layout shells:

- **`<AuthLayout>`** — centered card on gradient background. Wraps `/login`, `/register`, `/forgot-password`.
- **`<AppLayout>`** — left sidebar + main content area. Wraps `/dashboard`, `/activities`, `/money`. Protected by `<RequireAuth>` — redirects to `/login` if no session.

### Route map

| Path                | Component         | Layout       | Guard           |
| ------------------- | ----------------- | ------------ | --------------- |
| `/login`            | `LoginForm`       | AuthLayout   | redirect if auth'd |
| `/register`         | `RegisterForm`    | AuthLayout   | redirect if auth'd |
| `/forgot-password`  | `ForgotPasswordForm` | AuthLayout | —              |
| `/dashboard`        | `Dashboard`       | AppLayout    | `RequireAuth`   |
| `/activities`       | `ActivityTracker` | AppLayout    | `RequireAuth`   |
| `/money`            | `MoneyCalculator` | AppLayout    | `RequireAuth`   |
| `/`                 | redirect → `/dashboard` (or `/login`) | — | — |

### Sidebar

`<Sidebar>` (inside `AppLayout`) shows:
- App name / logo at top
- Three `NavLink`s (Dashboard / Activity Tracker / Money Calculator) with active-state styling
- Signed-in user email + **Log out** button at bottom

---

## 4. Authentication

All client-side, backed by `localStorage`. Two keys:

- `users` — array of registered users: `[{ id, name, email, passwordHash }]`
- `session` — current user: `{ id, name, email }` or `null`

### `src/auth.js` — the auth module

Exports:

```ts
register({ name, email, password }) → { ok: true } | { error: string }
login(email, password)              → { ok: true, user } | { error: string }
logout()
resetPassword(email, newPassword)   → { ok: true } | { error: string }
getSession()                        → user | null
```

Implementation notes:
- Email is the unique key. `register` fails with "Email already exists" if it does.
- For demo purposes, "passwordHash" is just `btoa(password)` — **not real hashing**. Comment in code makes this explicit and points at the API-migration spot.
- The demo user (`demo@example.com` / `password123`) is seeded into `users` on first load if the list is empty, so the login screen's "Fill demo" button still works.

### `<AuthProvider>` + `useAuth()`

A small React context wrapping `getSession()` + setters. Components read `useAuth()` instead of touching `localStorage` directly.

```jsx
const { user, login, register, logout, resetPassword } = useAuth();
```

`<RequireAuth>` uses `useAuth().user` to gate routes.

### Forgot password flow

No email server, so:
1. User enters email on `/forgot-password`.
2. If email exists in `users`, app shows an inline form asking for a new password (and confirmation).
3. On submit, call `resetPassword(email, newPassword)`, then redirect to `/login` with a success toast.
4. If email doesn't exist, show the same "if an account exists…" message (no enumeration) but don't proceed. (Demo-mode toggle: also show "(demo: email not found)" so the user knows why nothing happened.)

---

## 5. Pages

### 5.1 Dashboard (`/dashboard`)

Read-only summary built from the same hooks the other pages write to:

- **Today's date** header (e.g. "Thursday, May 21, 2026").
- **Stat cards**:
  - Activities logged today (count)
  - Total time tracked (sum of durations)
  - Net balance today (income − expense)
- **Two compact preview panels**:
  - Latest 3 activities (table row preview) with "View all →" linking to `/activities`
  - Latest 3 money entries with "View all →" linking to `/money`

### 5.2 Activity Tracker (`/activities`)

Already built. Excel-style table with columns: **Time / Activity / Duration (min) / Notes**. Add row, delete row, inline edit. Footer shows count + total time. Backed by `useDailyStore('activities')`.

### 5.3 Money Calculator (`/money`)

Already built. Form to add an entry (description / amount / category / type), live totals (Income / Expense / Net), and a scrollable entry list. Backed by `useDailyStore('money')`.

---

## 6. Data Layer

Two layered hooks — already extracted in the current codebase:

### `useLocalStorage(key, initial)` — primitive

`useState`-shaped hook that persists to `localStorage` on every change. Reads on mount.

### `useDailyStore(name, initial)` — domain wrapper

Wraps `useLocalStorage` with a daily key (`${name}:YYYY-MM-DD`) and returns CRUD helpers:

```js
const { rows, add, update, remove, set } = useDailyStore('activities', []);
```

- `add(item)` auto-assigns `crypto.randomUUID()`.
- `update(id, patch)` shallow-merges into the matching row.
- `remove(id)` filters out by id.
- `set(rows)` full replace (used later for API hydration).

**This is the API-migration seam.** When the backend is ready, only `useDailyStore`'s body changes — components stay identical.

---

## 7. File Structure

```
Claude task/
├── index.html
├── package.json
├── vite.config.js
├── PLAN.md                       ← this file
└── src/
    ├── main.jsx                   App bootstrap + Router
    ├── App.jsx                    Routes config
    ├── auth.js                    Auth module (localStorage-backed)
    ├── styles.css
    ├── context/
    │   └── AuthProvider.jsx       <AuthProvider> + useAuth()
    ├── hooks/
    │   ├── useLocalStorage.js     primitive (already exists)
    │   └── useDailyStore.js       domain wrapper (already exists)
    ├── layouts/
    │   ├── AuthLayout.jsx         centered card shell
    │   └── AppLayout.jsx          sidebar + main content shell
    ├── components/
    │   ├── Sidebar.jsx            NavLinks + user info + logout
    │   ├── RequireAuth.jsx        route guard
    │   ├── LoginForm.jsx          (already exists — minor refactor)
    │   ├── RegisterForm.jsx       (already exists — wire to auth.register)
    │   ├── ForgotPasswordForm.jsx (already exists — add reset step)
    │   ├── Dashboard.jsx          new summary version
    │   ├── ActivityTracker.jsx    (already exists, unchanged)
    │   └── MoneyCalculator.jsx    (already exists, unchanged)
```

---

## 8. Implementation Order

Each step is independently testable. Build in this order to keep the app runnable throughout.

1. **Install `react-router-dom`**, scaffold `<BrowserRouter>` in `main.jsx`, wire empty routes.
2. **Build `auth.js`** with `register / login / logout / resetPassword / getSession`. Seed demo user.
3. **Add `<AuthProvider>` / `useAuth()` context** and `<RequireAuth>` guard.
4. **Build `<AuthLayout>`**, port existing `LoginForm` / `RegisterForm` / `ForgotPasswordForm` to use `useAuth()` instead of inline state. Make Register actually create a user; Login actually check stored users.
5. **Extend ForgotPasswordForm** with the two-step reset (email → new password → confirm).
6. **Build `<AppLayout>` and `<Sidebar>`** with three nav items and the logout control.
7. **Split current Dashboard**: keep `ActivityTracker` and `MoneyCalculator` as their own pages; rewrite `Dashboard.jsx` as the summary view that pulls from the same `useDailyStore` hooks.
8. **Polish styling**: sidebar active state, responsive collapse on narrow screens (optional for v1).

---

## 9. What's Already Built vs. What's New

| Piece                          | Status                                    |
| ------------------------------ | ----------------------------------------- |
| Vite + React scaffold          | ✅ done                                   |
| `LoginForm` (demo creds)       | ✅ done — needs to read real users        |
| `RegisterForm`                 | ✅ done — needs to call `auth.register`   |
| `ForgotPasswordForm`           | ✅ done — needs the actual reset step     |
| `ActivityTracker`              | ✅ done, no changes                       |
| `MoneyCalculator`              | ✅ done, no changes                       |
| `useLocalStorage` hook         | ✅ done                                   |
| `useDailyStore` hook           | ✅ done                                   |
| Routing (`react-router-dom`)   | ❌ to add                                 |
| `auth.js` module               | ❌ to add (currently a stub in `auth.js`) |
| `<AuthProvider>` / `useAuth()` | ❌ to add                                 |
| `<RequireAuth>` guard          | ❌ to add                                 |
| `<AuthLayout>` / `<AppLayout>` | ❌ to add                                 |
| `<Sidebar>`                    | ❌ to add                                 |
| Dashboard summary page         | ❌ to add (current Dashboard becomes layout) |

---

## 10. Future: API Migration

When the backend exists, three swap points:

- **`auth.js`** — replace each function body with `fetch('/api/auth/...')`. Store the returned token in `localStorage` under a single key (e.g. `token`); session info comes from a `/me` call on mount instead of a `session` JSON blob.
- **`useDailyStore`** — replace the `useLocalStorage` call with `useState` + `useEffect` that calls `GET /api/:name?date=YYYY-MM-DD` on mount and the corresponding mutations on `add` / `update` / `remove`.
- **Password hashing** — remove the `btoa` placeholder. Real hashing happens server-side.

Component code does not change.

---

## 11. Out of Scope (for the demo)

- Real password hashing / security
- Email delivery for password reset
- Multi-day history view (the data is keyed by today's date; older days are reachable in `localStorage` but no UI yet)
- Export / import (CSV)
- Multi-user collaboration / real-time sync
- Accessibility audit (keyboard nav works, but no formal a11y pass)
