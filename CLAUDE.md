# CLAUDE.md

> This file gives Claude Code (and other AI assistants) the context needed to work on the Staxhaus IMA codebase effectively. **Read this first** before making any changes.

---

## 1. Project Overview

**Project Name:** Staxhaus IMA (Institute Management Application)
**Brand:** Staxhaus — *The School of Experience* (`</the school of experience>`)
**Type:** Invite-only, mobile-responsive web application for managing a self-learning IT institute.
**Location:** Kottakkal, Malappuram, India.

Staxhaus runs a 6-month hands-on IT training program. The IMA manages courses, batches, modules, students, facilitators, interviewers, attendance, leaves, daily scrum calls, and end-of-module interviews.

**Companion docs:**
- `docs/01_staxhaus_brd.md` — Business Requirements Document (the *what*)
- `docs/02_staxhaus_tech_spec.md` — Technical Implementation Guide (the *how*)

When in doubt about business logic or technical decisions, those two documents are authoritative. This `CLAUDE.md` is the working summary.

---

## 2. Tech Stack

**Backend (`server/`)**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT auth (access + refresh tokens)
- Joi for validation
- Nodemailer for emails
- Winston for logging
- Helmet + express-rate-limit for security

**Frontend (`client/`)**
- React 18+ with Vite
- React Router DOM v6
- Tailwind CSS v4 (with `@theme` brand tokens)
- Framer Motion for animations
- TanStack React Query for server state
- React Hook Form + Joi for forms
- Axios for HTTP
- Lucide React for icons
- Recharts for charts
- React Hot Toast for notifications

**Tooling**
- ESLint (Airbnb) + Prettier
- Husky + lint-staged
- Conventional Commits

---

## 3. Folder Structure

```
staxhaus-ima/
├── client/
│   ├── public/
│   │   ├── fonts/        # Helvena .otf (200–800)
│   │   └── logos/        # logo-light, logo-dark, x-mark, etc.
│   └── src/
│       ├── api/          # Axios instance + endpoint modules per resource
│       ├── assets/
│       ├── components/   # Reusable UI primitives (ui/, layout/, forms/, tables/, charts/)
│       ├── features/     # Feature-folder pattern: auth, invitations, batches, etc.
│       ├── pages/        # Route wrappers per role (admin/, facilitator/, student/, ...)
│       ├── hooks/
│       ├── context/      # AuthContext, ThemeContext
│       ├── routes/       # AppRoutes, ProtectedRoute, RoleRoute
│       ├── utils/        # constants, formatters, validators
│       └── styles/
├── server/
│   └── src/
│       ├── config/       # db, env, mailer
│       ├── models/       # Mongoose schemas (one per entity)
│       ├── controllers/  # HTTP layer — thin
│       ├── services/     # Business logic — controllers stay thin
│       ├── routes/       # Per-module route files, mounted under /api
│       ├── middleware/   # auth, role (RBAC), validate, error, audit
│       ├── validators/   # Joi schemas
│       ├── utils/        # apiResponse, apiError, asyncHandler, token, emailTemplates
│       ├── jobs/         # cron jobs (invite expiry, etc.)
│       ├── app.js
│       └── server.js
├── docs/
│   ├── 01_staxhaus_brd.md
│   └── 02_staxhaus_tech_spec.md
├── .husky/
├── .gitignore
├── package.json          # root — concurrently runs both
└── README.md
```

**Why this structure:**
- **Backend layered**: `route → middleware → controller → service → model`. Controllers parse the request and call services. **Business logic never lives in controllers.**
- **Frontend feature-folder**: code is grouped by *what it does* (auth, batches, leaves), not by file type.

---

## 4. Critical Business Rules (memorize these)

These are the rules that catch most bugs. Verify any change against them.

### 4.1 Access & Onboarding
- **The system is invite-only.** No public sign-up route exists. Don't add one.
- Admins can invite Admins, Facilitators, Interviewers, Students.
- Facilitators can invite **Students only** (into batches they own).
- Interviewers and Students cannot invite anyone.
- Invite tokens are single-use, time-limited (default 7 days), cryptographically random.
- Duplicate **pending** invitations for the same email are blocked at the DB level (partial unique index).

### 4.2 Student Status
- Three states: `active`, `discontinued`, `terminated`.
- **All transitions are reversible** — `active ↔ discontinued ↔ terminated`.
- Every status change requires a remark and is written to `EnrollmentStatusHistory` + `AuditLog`.
- Discontinued/Terminated students cannot submit tasks, attend scrum calls, or be assigned interviews — but their data is preserved.
- On reinstatement, a student resumes from their last recorded module/task state. **No re-invitation needed.**

### 4.3 Batch Configuration (Per-Batch Policy)
- Every batch has its own `BatchConfig` with: `leaveLimit`, `leaveLimitPeriod` (`per_module` | `per_course`), `reinterviewLimit`, `scrumCallTime`, `workingDays`.
- Set/edited by Admin only.
- The system enforces these limits and **blocks further requests when exceeded** unless an Admin override is granted (logged).

### 4.4 Attendance
- Marked daily by the **Academic Facilitator only**.
- States: `present | absent | leave | half_day`.
- **Daily scrum call attendance is mandatory.** Missing the scrum call without an approved leave auto-marks the student `absent` for that day.
- Approved leaves auto-sync into the attendance record as `leave`.

### 4.5 Leave Requests
- Raised by **Students only**, reviewed by their **Academic Facilitator only**.
- System validates against the batch's `leaveLimit` before submission.
- Approval auto-decrements the student's leave balance and creates the attendance entry.
- Lifecycle: `pending → approved | rejected`.

### 4.6 Interviews
- End-of-module interviews are **mandatory** for progression.
- Facilitator schedules and assigns interviewers (from the invited interviewer pool).
- **Only the Facilitator records the score** (based on interviewer feedback).
- Failed students go to re-interview, bound by the batch's `reinterviewLimit`.
- Exhausting the limit escalates the case to Admin.

### 4.7 Multi-Batch Facilitators
- A single Academic Facilitator can own multiple batches simultaneously.
- A batch always has exactly one facilitator and exactly one course.
- A student belongs to exactly one batch at a time.

---

## 5. User Roles & Permissions Matrix

| Action | Admin | Facilitator | Interviewer | Student |
|--------|:-----:|:-----------:|:-----------:|:-------:|
| Invite users (any role) | ✅ | — | — | — |
| Invite students | ✅ | ✅ (own batches) | — | — |
| Create courses/modules | ✅ | — | — | — |
| Create batches | ✅ | — | — | — |
| Edit batch config | ✅ | — | — | — |
| Mark attendance | — | ✅ (own batches) | — | — |
| Approve/reject leaves | — | ✅ (own batches) | — | — |
| Run scrum calls | — | ✅ (own batches) | — | — |
| Assign interviewers | — | ✅ (own batches) | — | — |
| Record interview scores | — | ✅ (own batches) | — | — |
| Conduct interviews | — | — | ✅ | — |
| Submit interview feedback | — | — | ✅ | — |
| Change student status | ✅ | ✅ (own batches) | — | — |
| Override limits | ✅ | — | — | — |
| View audit log | ✅ | — | — | — |
| Submit tasks | — | — | — | ✅ |
| Raise leave requests | — | — | — | ✅ |

When adding a new endpoint, **always** map it onto this matrix and add the `requireRole(...)` guard accordingly.

---

## 6. Brand & Design System (Always Apply)

The IMA inherits the Staxhaus brand from the marketing site. **Do not introduce new colors, fonts, or component styles** without confirming with the design lead.

### Colors (Tailwind tokens already in `tailwind.config.js`)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-orange` | `#E8391D` | CTAs, buttons, highlights, accents |
| `brand-charcoal` | `#1E2126` | Primary text, dark backgrounds (sidebar) |
| `brand-gray` | `#929292` | Secondary text, captions, borders |
| `brand-light` | `#F7F7F5` | Page/section backgrounds |
| white | `#FFFFFF` | Card fills, base background |

### Typography
- **Helvena** is the only font (custom, 7 weights). Loaded from `/public/fonts/`.
- Mono (for tagline/code) uses JetBrains Mono.
- Type scale follows the BRD §13.3.

### Animation
- Framer Motion only.
- Standard easing curve: `[0.25, 0.46, 0.45, 0.94]`.
- Standard scroll-in: `opacity 0→1, y 24→0, duration 0.55s`.

### Mobile-First (NON-NEGOTIABLE)
- Write base classes for mobile, scale up with `sm:` / `md:` / `lg:`. **Never** the reverse.
- Sidebar collapses into a hamburger drawer below `md` (768px).
- Tables convert to stacked card lists below `md`. **No horizontal scrolling on mobile.**
- Touch targets ≥ 44 × 44 px.
- Test at: 360×640, 768×1024, 1280×800, 1920×1080.

### IMA-Specific UI Conventions
- **App shell sidebar:** `bg-brand-charcoal`, white text, orange active state.
- **Status badges:**
  - Active → green/orange tint
  - Discontinued → gray + strikethrough
  - Terminated → solid charcoal pill, white text
- **Invitation status:** Pending → orange outline, Accepted → green, Expired → gray, Revoked → strikethrough.
- **Pass / Fail:** Pass → green tone; Fail → `brand-orange`.
- **Login screen:** No "Sign Up" CTA. Subtitle reads: *"Staxhaus is invite-only. Check your inbox for an invitation."*
- **Empty states:** Centered X-mark watermark + one-line conversational copy.

---

## 7. Coding Standards (Enforce on Every Change)

### General
1. **One responsibility per file.** Soft cap: 200 lines.
2. **No magic strings.** Roles, statuses, event names live in `utils/constants.js` (both client and server).
3. **Naming:** `camelCase` (vars/funcs), `PascalCase` (components/models), `UPPER_SNAKE` (constants).
4. **Async/await only.** No `.then()` chains.
5. **All async route handlers wrapped in `asyncHandler`.**

### Backend
1. **Controllers are thin.** Parse → call service → return response.
2. **Validate at the edge.** Every POST/PATCH route has a Joi schema in `validators/`.
3. **Services throw `ApiError`** on failure. Never `res.status(...).send()` from a service.
4. **Audit-loggable actions go through `audit.service.js`.** Don't write to `AuditLog` from controllers.
5. **Use Mongoose transactions** for multi-document writes (e.g., accepting an invite: create User + update Invitation + write AuditLog).
6. **Index every queried field** — `email`, `batch`, `student`, `date`, `status`.
7. **Never log secrets, JWTs, or full passwords.** Winston has PII filters configured.

### Frontend
1. **Pages are thin routing wrappers.** Real UI lives in `features/`.
2. **One component per file.** Co-locate small sub-components only when used solely by the parent.
3. **No `axios` calls inside components.** All API access goes through `src/api/<resource>.api.js`.
4. **No `useEffect` for fetching** — use React Query hooks (`useStudents`, `useBatchAttendance`) defined in `features/<name>/queries.js`.
5. **Forms use React Hook Form.** No uncontrolled refs.
6. **Tailwind classes in JSX.** No `styled-components`, no separate CSS files (except `styles/index.css` and `styles/fonts.css`).
7. **Accessibility:** every interactive element has a label or `aria-label`; modals trap focus; form errors link to inputs via `aria-describedby`.

### Standard API Response Shape
```json
// Success
{ "success": true, "data": { ... }, "message": "Optional" }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": {} } }
```

---

## 8. API Conventions

### Route naming (always use these patterns)
```
/api/auth/login                         POST
/api/auth/accept-invite                 POST
/api/auth/me                            GET

/api/invitations                        POST | GET
/api/invitations/:id/resend             POST
/api/invitations/:id/revoke             POST

/api/courses                            CRUD
/api/courses/:id/modules                GET | POST

/api/batches                            CRUD
/api/batches/:id/config                 GET | PATCH
/api/batches/:id/students               GET

/api/students/:id/status                PATCH

/api/attendance                         POST
/api/attendance/batch/:batchId          GET

/api/leaves                             POST
/api/leaves/:id/review                  PATCH

/api/scrum-calls                        POST
/api/scrum-calls/batch/:batchId         GET

/api/interviews                         POST
/api/interviews/:id/score               POST
/api/interviews/:id/reinterview         POST
```

### Auth
- Access token in `Authorization: Bearer <token>` header (1 hour TTL).
- Refresh token in httpOnly cookie (7 days).
- Frontend: token stored in `localStorage` (the Axios interceptor in `client/src/api/axios.js` attaches it).
- 401 response → frontend redirects to `/login`.

---

## 9. How Claude Should Work in This Codebase

### Before making changes
1. **Read the relevant feature folder fully** before editing any file in it.
2. **Check `utils/constants.js`** before introducing any string literal for roles, statuses, or event types.
3. **Verify the business rule in §4** of this file (or in the BRD) before changing logic.
4. **Confirm role permissions in §5** before touching any route or button visibility.

### When adding a new feature
1. Backend first: model → validator → service → controller → route → wire up middleware (`authMiddleware`, `requireRole`, `validate`).
2. Frontend after: API module in `src/api/` → React Query hook in `features/<name>/queries.js` → components in `features/<name>/components/` → page wrapper in `pages/<role>/`.
3. Always add an audit log entry for state-changing actions (status changes, config edits, overrides, invitation events).
4. Always add the matching Joi validator. No POST/PATCH ships without validation.
5. Mobile responsiveness is **part of the feature**, not a follow-up. Test at 360px width.

### When fixing a bug
1. Reproduce the bug first; don't speculate.
2. Check whether it's a business-rule violation (§4) before assuming it's a code bug.
3. Add a test for the scenario before fixing if the bug is in a service.

### When refactoring
1. **Don't refactor and add features in the same commit.** Keep them separate for review clarity.
2. Preserve the layered structure (route → controller → service → model). Don't shortcut it.
3. If a file goes over 200 lines after your change, split it.

### Things Claude should NEVER do
- ❌ Add a public sign-up route or registration form.
- ❌ Put business logic in controllers.
- ❌ Call `axios` directly from a React component.
- ❌ Skip the Joi validator on a POST/PATCH route.
- ❌ Hardcode role strings (`"admin"`, `"facilitator"`) — use constants.
- ❌ Build a desktop-first UI and "make it responsive later."
- ❌ Add a new color, font, or border-radius outside the brand tokens.
- ❌ Skip the `requireRole(...)` guard on protected routes.
- ❌ Write to `AuditLog` directly — go through `audit.service.js`.
- ❌ Log JWTs, passwords, or full email contents.
- ❌ Introduce Redux, MobX, or any other state library — React Query + Context is enough.
- ❌ Add a third-party UI kit (Material UI, Ant Design, Chakra). Tailwind + custom components only.

---

## 10. Common Tasks — Quick Recipes

### Add a new API endpoint
```
1. server/src/validators/<resource>.validator.js  → Joi schema
2. server/src/services/<resource>.service.js      → business logic
3. server/src/controllers/<resource>.controller.js → thin HTTP handler
4. server/src/routes/<resource>.routes.js         → wire authMiddleware + requireRole + validate
5. server/src/routes/index.js                     → mount the route file (if new)
6. client/src/api/<resource>.api.js               → axios call
7. client/src/features/<feature>/queries.js       → React Query hook
8. Use the hook in the feature component
```

### Add a new role-restricted page
```
1. client/src/pages/<role>/<PageName>.jsx
2. client/src/routes/AppRoutes.jsx                → wrap in <RoleRoute roles={['admin']}>
3. client/src/components/layout/Sidebar.jsx       → add nav item conditionally by role
```

### Run the app locally
```bash
npm run dev          # from repo root — runs server (5000) + client (5173)
```

### Seed a Super Admin
```bash
npm run seed --prefix server
```

### Run lint + format
```bash
npm run lint
npm run format
```

---

## 11. Environment Variables

### `server/.env`
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/staxhaus_ima
JWT_SECRET=...
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRES_IN=7d
INVITE_TOKEN_EXPIRES_DAYS=7
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM="Staxhaus <noreply@staxhaus.in>"
```

### `client/.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BRAND_NAME=staxhaus
```

Never commit `.env` files. Use the host's secret manager in production.

---

## 12. Git Workflow

- **Branches:** `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`, `refactor/<short-desc>`.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.
- **PRs:** small, focused, one concern. Include screenshots for UI changes (mobile + desktop).
- **CI gates:** lint must pass, tests must pass, no `console.log` in production code.
- Husky runs lint-staged on every commit; don't bypass with `--no-verify` unless cleaning a hotfix.

---

## 13. When You're Unsure

If a request is ambiguous or seems to conflict with the BRD or the rules above:

1. **Stop. Don't assume.**
2. State the conflict clearly.
3. Quote the relevant BRD section or §4 rule.
4. Ask for clarification before proceeding.

This is preferable to shipping code that violates a business rule and has to be unwound later.

---

## 14. Document Versioning

| Doc | Version | Last Updated |
|-----|---------|-------------|
| BRD | 6.0 | — |
| Tech Spec | 1.0 | — |
| CLAUDE.md (this file) | 1.0 | — |

When the BRD or Tech Spec is updated, update this file's "memorize these" sections (§4, §5, §6) accordingly.

---

*This file is the contract. If the code violates it, the code is wrong — not the contract.*
