# SkillCast Technical Documentation

**Complete reference for database schema, API endpoints, component architecture, and development roadmap.**

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [React Component Tree](#react-component-tree)
4. [API Endpoints](#api-endpoints)
5. [Application Functionality](#application-functionality)
6. [Presentation Highlights](#presentation-highlights)
7. [Future Development Plans](#future-development-plans)

---

## Database Schema

### Tables Overview

#### `users`

| Column          | Type         | Constraints      | Description                                   |
| --------------- | ------------ | ---------------- | --------------------------------------------- |
| `id`            | UUID         | PRIMARY KEY      | Unique user identifier                        |
| `username`      | VARCHAR(50)  | UNIQUE, NOT NULL | Login handle                                  |
| `email`         | VARCHAR(100) | UNIQUE, NOT NULL | Email address                                 |
| `password_hash` | VARCHAR(255) | NOT NULL         | bcrypt hashed password (12 rounds)            |
| `name`          | VARCHAR(100) |                  | Display name                                  |
| `bio`           | TEXT         |                  | Profile bio/description                       |
| `credit`        | INTEGER      | DEFAULT 0        | Social currency (earned from gratitude notes) |
| `role`          | VARCHAR(20)  | DEFAULT 'member' | 'member' or 'admin'                           |
| `created_at`    | TIMESTAMPTZ  | DEFAULT NOW()    | Account creation timestamp                    |
| `updated_at`    | TIMESTAMPTZ  | DEFAULT NOW()    | Last profile update                           |

#### `skills`

| Column       | Type         | Constraints      | Description                             |
| ------------ | ------------ | ---------------- | --------------------------------------- |
| `id`         | UUID         | PRIMARY KEY      | Unique skill identifier                 |
| `name`       | VARCHAR(100) | UNIQUE, NOT NULL | Skill/topic name (e.g., "React")        |
| `category`   | VARCHAR(50)  | NOT NULL         | Category (e.g., "Technology", "Design") |
| `created_at` | TIMESTAMPTZ  | DEFAULT NOW()    | Skill creation timestamp                |

#### `casts`

| Column         | Type         | Constraints             | Description                      |
| -------------- | ------------ | ----------------------- | -------------------------------- |
| `id`           | UUID         | PRIMARY KEY             | Unique cast/broadcast identifier |
| `creator_id`   | UUID         | FOREIGN KEY → users.id  | Cast creator                     |
| `skill_id`     | UUID         | FOREIGN KEY → skills.id | Associated skill/topic           |
| `title`        | VARCHAR(255) | NOT NULL                | Cast title                       |
| `description`  | TEXT         |                         | Detailed description             |
| `meeting_link` | VARCHAR(500) |                         | Zoom/video conference URL        |
| `is_live`      | BOOLEAN      | DEFAULT false           | Live status flag                 |
| `created_at`   | TIMESTAMPTZ  | DEFAULT NOW()           | Cast creation time               |
| `updated_at`   | TIMESTAMPTZ  | DEFAULT NOW()           | Last edit time                   |

#### `gratitude_notes`

| Column       | Type        | Constraints                              | Description            |
| ------------ | ----------- | ---------------------------------------- | ---------------------- |
| `id`         | UUID        | PRIMARY KEY                              | Unique note identifier |
| `cast_id`    | UUID        | FOREIGN KEY → casts.id ON DELETE CASCADE | Associated cast        |
| `sender_id`  | UUID        | FOREIGN KEY → users.id                   | Note author            |
| `content`    | TEXT        | NOT NULL                                 | Gratitude message      |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW()                            | Note timestamp         |

#### `refresh_tokens`

| Column       | Type        | Constraints                              | Description              |
| ------------ | ----------- | ---------------------------------------- | ------------------------ |
| `token`      | TEXT        | PRIMARY KEY                              | JWT refresh token string |
| `user_id`    | UUID        | FOREIGN KEY → users.id ON DELETE CASCADE | Token owner              |
| `expires_at` | TIMESTAMPTZ | NOT NULL                                 | 7-day expiration         |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW()                            | Token issue time         |

### Key Design Decisions

- **UUID primary keys**: Distributed system readiness, privacy (no sequential IDs)
- **Cascade delete on refresh_tokens & notes**: Prevents orphaned records
- **Credit as integer**: Simple social currency model (no decimal places)
- **Role enum (member/admin)**: Simple binary permissions model
- **Timestamp defaults**: Automatic auditing (created_at, updated_at)

---

## Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                         │
└──────────────────────────────────────────────────────────────────┘

                              ┌───────────┐
                              │   users   │
                              └─────┬─────┘
                                    │ id (UUID)
                          ┌─────────┼─────────┐
                          │         │         │
                          ▼         ▼         ▼
                    ┌──────────┐ ┌───────┐ ┌─────────────────┐
                    │   casts  │ │ notes │ │ refresh_tokens  │
                    └─────┬────┘ └─┬─────┘ └─────────────────┘
                          │        │
                    skill_id   cast_id
                          │        │
                          ▼        │
                    ┌──────────┐   │
                    │  skills  │   │
                    └──────────┘   │
                                   │
                    ┌──────────────┘
                    │  sender_id
                    ▼
                 (users)

RELATIONSHIPS:
- users (1) ──creates──> (M) casts
- users (1) ──sends──> (M) gratitude_notes
- casts (M) ──contains──> (1) skill
- casts (1) ──has_many──> (M) gratitude_notes
- gratitude_notes (M) ──sent_by──> (1) users
- users (1) ──has_many──> (M) refresh_tokens
```

---

## React Component Tree

```
App
├── AuthProvider (Context wrapper)
│   └── Router
│       ├── Navbar
│       │   ├── Logo (SKILLCAST)
│       │   ├── Home Link
│       │   ├── Profile Link (conditional)
│       │   ├── Admin Link (admin only)
│       │   └── Auth Buttons (Login/Logout)
│       │
│       └── Routes
│           ├── / (Home)
│           │   └── Home
│           │       ├── Sidebar (Identity card)
│           │       │   └── User Info Display
│           │       ├── CastFeed
│           │       │   └── CastCard (multiple)
│           │       │       ├── Title & Description
│           │       │       ├── Join Button
│           │       │       ├── CreditForm (gratitude)
│           │       │       └── Edit/End Controls (owner)
│           │       └── Leaderboard
│           │           └── Top 10 Users Table
│           │
│           ├── /login (Login)
│           │   └── Login
│           │       └── Form (email, password)
│           │
│           ├── /profile/:id (Profile)
│           │   └── Profile
│           │       ├── User Stats
│           │       ├── Bio
│           │       └── Casts Created
│           │
│           ├── /settings/profile (EditProfile)
│           │   └── EditProfile
│           │       └── Form (name, bio)
│           │
│           ├── /create (Protected - CreateCast)
│           │   └── CreateCast
│           │       └── Form (title, description, skill, link)
│           │
│           ├── /admin/users (Protected - AdminUsers)
│           │   └── AdminUsers
│           │       ├── Users Table
│           │       ├── EditUserModal
│           │       │   └── Form (name, credit, role)
│           │       ├── CreateUserModal
│           │       │   └── Form (username, email, password, role)
│           │       └── DeleteConfirmation
│           │
│           ├── /admin/skills (Protected - AdminSkills)
│           │   └── AdminSkills
│           │       ├── Skills Table
│           │       ├── CreateSkillModal
│           │       │   └── Form (name, category)
│           │       ├── EditSkillModal
│           │       │   └── Form (name, category)
│           │       └── DeleteConfirmation
│           │
│           └── * (404)

SHARED COMPONENTS:
├── ui/Button (primary action button with variants)
├── layout/Protected (auth guard wrapper)
├── layout/Navbar (top navigation)
└── layout/layout.jsx (main structure)

CONTEXT:
├── AuthContext (JWT tokens, user state, login/logout)
└── useAuth() hook (access user & auth methods)

UTILITIES:
├── api/axios (HTTP client with auth headers)
└── hooks/usePulse (cast data fetching)
```

---

## API Endpoints

### Authentication

| Method | Path                 | Auth | Description        | Request Body                         | Response                                                   |
| ------ | -------------------- | ---- | ------------------ | ------------------------------------ | ---------------------------------------------------------- |
| POST   | `/api/auth/register` | No   | Create account     | `{username, email, password, name?}` | `{id, username, email, token, refreshToken}`               |
| POST   | `/api/auth/login`    | No   | Sign in            | `{email, password}`                  | `{user: {id, username, email, role}, token, refreshToken}` |
| POST   | `/api/auth/refresh`  | No   | Renew access token | `{refreshToken}`                     | `{token, refreshToken}`                                    |
| POST   | `/api/auth/logout`   | Yes  | Invalidate tokens  | `{}`                                 | `{message}`                                                |

### Users

| Method | Path                     | Auth        | Description                     | Request Body              | Response                                                               |
| ------ | ------------------------ | ----------- | ------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| GET    | `/api/users/profile/:id` | No          | Get user profile & stats        | -                         | `{id, username, name, bio, credit, role, total_casts, notes_received}` |
| PUT    | `/api/users/profile/:id` | Yes         | Update profile (owner/admin)    | `{name?, bio?}`           | Updated user object                                                    |
| GET    | `/api/users/leaderboard` | No          | Top 10 users by credit          | -                         | `[{id, username, credit}, ...]`                                        |
| GET    | `/api/users/admin/all`   | Yes (admin) | All users (admin only)          | -                         | `[{id, username, email, role, credit, created_at}, ...]`               |
| PUT    | `/api/users/admin/:id`   | Yes (admin) | Update user fields (admin only) | `{name?, credit?, role?}` | Updated user object                                                    |
| DELETE | `/api/users/:id`         | Yes (admin) | Delete user (admin only)        | -                         | `{message, id}`                                                        |

### Skills

| Method | Path              | Auth        | Description               | Request Body         | Response                      |
| ------ | ----------------- | ----------- | ------------------------- | -------------------- | ----------------------------- |
| GET    | `/api/skills`     | No          | Get skill catalog         | -                    | `[{id, name, category}, ...]` |
| POST   | `/api/skills`     | Yes (admin) | Create skill (admin only) | `{name, category}`   | `{id, name, category}`        |
| PUT    | `/api/skills/:id` | Yes (admin) | Update skill (admin only) | `{name?, category?}` | Updated skill object          |
| DELETE | `/api/skills/:id` | Yes (admin) | Delete skill (admin only) | -                    | `{message, id}`               |

### Casts

| Method | Path             | Auth              | Description      | Request Body                                             | Response                                                                                   |
| ------ | ---------------- | ----------------- | ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| GET    | `/api/casts`     | No                | List all casts   | query: `category?, search?`                              | `[{id, creator_id, skill_id, title, description, meeting_link, is_live, created_at}, ...]` |
| POST   | `/api/casts`     | Yes               | Create cast      | `{skill_id, title, description, meeting_link, is_live?}` | `{id, creator_id, skill_id, title, ...}`                                                   |
| PUT    | `/api/casts/:id` | Yes (owner/admin) | Update cast      | `{title?, description?, meeting_link?, is_live?}`        | Updated cast object                                                                        |
| DELETE | `/api/casts/:id` | Yes (owner/admin) | Delete cast      | -                                                        | `{message, id}`                                                                            |
| GET    | `/api/casts/:id` | No                | Get cast details | -                                                        | Cast object with creator info                                                              |

### Gratitude Notes

| Method | Path                       | Auth | Description          | Request Body         | Response                                        |
| ------ | -------------------------- | ---- | -------------------- | -------------------- | ----------------------------------------------- |
| POST   | `/api/notes`               | Yes  | Send gratitude note  | `{cast_id, content}` | `{id, cast_id, sender_id, content, created_at}` |
| GET    | `/api/notes/cast/:cast_id` | No   | Get notes on a cast  | -                    | `[{id, sender_id, content, created_at}, ...]`   |
| GET    | `/api/notes/user/:user_id` | No   | Get notes for a user | -                    | `[{...}]`                                       |

### Response Patterns

**Success (200, 201):**

```json
{
  "id": "uuid",
  "username": "string",
  "credit": 42
}
```

**Error (400, 403, 404, 500):**

```json
{
  "error": "Descriptive error message"
}
```

**Auth Error (401):**

```json
{
  "error": "Unauthorized - token expired or missing"
}
```

---

## Application Functionality

### 1. Authentication Flow

**Registration:**

- User enters username, email, password, optional name
- Password hashed with bcrypt (12 salt rounds)
- New user created with role='member', credit=0
- Returns JWT access token (15-min expiry) + refresh token (7-day)
- Tokens stored in localStorage (AuthContext manages state)

**Login:**

- User submits email + password
- Server verifies password hash against stored hash
- Issues new JWT pair (access + refresh tokens)
- AuthContext persists tokens and user data locally
- Subsequent requests include `Authorization: Bearer <token>` header

**Token Refresh:**

- 15-minute access token expires
- Frontend detects 401 response
- Calls `/auth/refresh` with stored refreshToken
- Gets new access token without re-login
- If refresh token expires (7 days), user must login again

### 2. Cast Lifecycle (Knowledge Sharing)

**Create:**

- User navigates to `/create` (protected route)
- Selects skill from dropdown (e.g., "React", "Design Thinking")
- Enters title, description, and Zoom/Teams meeting link
- Clicks POST → new cast created with `creator_id=req.user.id`
- Redirects to home feed, new cast appears at top

**Browse:**

- Home page displays all casts in a feed
- Filter by skill channel (Technology, Design, Leadership, etc.)
- Search by title/description keywords
- "JOIN_CAST" button opens meeting link in external tab/Zoom client

**View Details:**

- Click cast card → expands to show full details
- See creator profile info
- View all gratitude notes sent to this cast
- If owner: "EDIT" and "END_CAST" buttons available (cyan)

**Edit:**

- Owner clicks "EDIT" button (cyan)
- Modal form pre-populated with current title, description, link
- Update any field + save
- Server verifies ownership (`req.user.id === cast.creator_id`)

**Delete:**

- Owner clicks "END_CAST" (pink variant)
- Confirmation dialog prevents accidents
- Cascading delete removes all associated gratitude notes
- Creator profile updated (cast count decreases)

### 3. Gratitude System (Social Currency)

**Sending Credit:**

- Attendee presses heart icon on cast card
- CreditForm modal opens with text area
- Types gratitude message (e.g., "Great React insights!")
- Clicks "SEND_GRATITUDE"
- Server:
  - Creates `gratitude_notes` record
  - Increments cast creator's credit by +10
  - Prevents self-gratitude (sender ≠ creator)
  - Records timestamp

**Viewing Earned Credit:**

- Cast creator sees gratitude note on their cast detail view
- Owner's profile shows "notes_received" count
- Profile page displays total `credit` (earned from all casts)
- Leaderboard ranks top 10 users by credit (descending)

### 4. Leaderboard (Gamification)

- Widget on home page sidebar
- Displays top 10 users ranked by total `credit` desc
- Shows username + credit count
- Updated in real-time as notes are sent
- Neo-brutalist styling: bold borders, yellow highlight (#FFD100)

### 5. User Profiles

**Viewing:**

- Click username anywhere → navigate to `/profile/:id`
- Displays user's bio, name, created_at
- Shows stats: casts_created, notes_received
- Lists all casts they've created
- View their credit count

**Editing (Owner Only):**

- Navigate to `/settings/profile`
- Form to update name + bio
- Submit → PUT `/api/users/profile/:id`
- Server verifies `req.user.id === id` or admin role
- Profile refreshes with new data

### 6. Admin User Management

**Access:**

- Only `role='admin'` users can access `/admin/users`
- Non-admins redirected to home
- "Admin" link appears in navbar for admins
- Protected by `<Protected>` wrapper + client-side role check

**View All Users:**

- Table shows: username, email, role badge, credit count
- Sorted by creation date (newest first)
- Displays total user count

**Create User:**

- "CREATE USER" button opens modal form
- Admin enters: username, email, password, name, role
- POST `/api/auth/register` creates account
- Defaults to member role (admin can change import to admin after)
- Auto-added to users list

**Edit User:**

- Click Edit (cyan pencil icon) on any user row
- Modal form: name, email (read-only), credit, role
- PUT `/api/users/admin/:id` with updated fields
- Admins can change role, credit, name
- Prevents admins from downgrading themselves

**Delete User:**

- Click Delete (pink trash icon) on user row
- Confirmation dialog: "Are you sure?"
- DELETE `/api/users/:id` removes user + all related records
- Gratitude notes & casts cascaded deleted
- Prevents self-deletion (security)

### 7. Admin Skill Management

**Access:**

- Only `role='admin'` users can access `/admin/skills`
- Non-admins redirected to home
- "SKILLS" link appears in navbar for admins (next to ADMIN link)
- Protected by `<Protected>` wrapper + client-side role check

**View All Skills:**

- Table displays all current skills with columns: Name, Category, Actions
- Skills grouped by category (TECHNOLOGY, DESIGN, ART, LIFESTYLE, etc.)
- Category shown as yellow badge (`bg-yellow-300`)
- Action buttons: Edit (cyan pencil), Delete (pink trash)
- Real-time updates as skills are added/edited/deleted

**Create Skill:**

- "CREATE_SKILL" button opens modal form
- Admin enters: name (text), category (text)
- POST `/api/skills` creates new skill record
- Validation ensures both fields are required
- Success feedback updates table immediately
- New skill available in CreateCast dropdown

**Edit Skill:**

- Click Edit (cyan pencil icon) on any skill row
- Modal form pre-populated with current name + category
- Admin modifies name and/or category
- PUT `/api/skills/:id` saves changes
- Error handling if name is duplicate (UNIQUE constraint)
- Updated skill reflected in CreateCast filters

**Delete Skill:**

- Click Delete (pink trash icon) on any skill row
- Confirmation modal: "Delete this skill?"
- DELETE `/api/skills/:id` removes skill from catalog
- WARNING: Orphans any casts that used this skill
- Prevents accidental deletion with confirmation step
- Skill removed from CreateCast dropdown filters

---

## Presentation Highlights

### Key Talking Points

#### 1. **Neo-Brutalist Design System**

- **Raw, authentic aesthetic**: 4px solid black borders, 8px offset box shadows
- **Bold typography**: Font-black for headers, mono fonts for data
- **Intentional color palette**: 6 colors + off-white canvas = cohesive system
- **Accessibility + personality**: High contrast, readable on all screens, memorable vibe

#### 2. **Social Currency Model (Credit System)**

- **Intrinsic motivation**: Users earn credit by being helpful and generous
- **Leaderboard gamification**: Visible ranking drives healthy competition
- **Measurable impact**: Cast creators see immediate feedback (gratitude notes)
- **Scalable**: Credit can fuel future rewards (badges, privileges, perks)

#### 3. **Role-Based Access Control**

- **Flexible permissions**: Member (create/update own) vs Admin (full control)
- **Self-protection**: Users can't delete own accounts, admins can't downgrade themselves
- **Audit trail ready**: created_at/updated_at timestamps on all records
- **Extensible**: Easy to add moderator, instructor, sponsor roles

#### 4. **JWT Authentication + Refresh Tokens**

- **Secure**: Passwords hashed bcrypt, short-lived access tokens, revocable refresh tokens
- **Seamless UX**: Auto-refresh keeps users logged in for 7 days
- **Stateless**: No server-side sessions, scales horizontally
- **Mobile-friendly**: Works with native apps, PWAs, and SPAs

#### 5. **Database Design for Scale**

- **UUID primary keys**: Privacy (can't guess IDs), distributed system ready
- **Efficient queries**: Indexes on foreign keys, aggregates pre-computed (credit)
- **Data integrity**: Cascading deletes, NOT NULL constraints, unique emails/usernames
- **Audit safety**: Timestamps on all records, immutable logs (notes)

#### 6. **Component Architecture**

- **React hooks + Context API**: Lightweight, no Redux boilerplate
- **Reusable components**: Button variants, form fields, modals
- **Tailwind CSS**: Utility-first styling, responsive design, consistent spacing
- **Protected routes**: Auth guards at route level, client-side + server-side checks

#### 7. **Skill Catalog (Admin-Driven)**

- **Organized knowledge**: Skills grouped by channels (Technology, Design, Leadership)
- **Easy management**: Admins can create/edit/delete skills
- **Course-ready**: Foundation for future course content, badges, prerequisites
- **Taxonomy**: Extensible to include complexity levels, learning paths

---

## Future Development Plans

### Phase 2: Enhanced Engagement (Q2 2026)

- [ ] **Real-time notifications**
  - WebSocket connections for live cast alerts
  - Email digests of trending skills
  - In-app notification bell with DM support

- [ ] **Advanced search & filtering**
  - Full-text search on cast titles/descriptions
  - Filter by skill channel, creator, date range
  - Save favorite searches/skills

- [ ] **Cast recording & replay**
  - Integrate Agora/Daily.co for recorded streams
  - Library of past casts searchable by channel
  - Replay analytics (viewer count, engagement)

### Phase 3: Mobile & Analytics (Q3 2026)

- [ ] **Mobile app (React Native)**
  - Native iOS/Android builds
  - Push notifications for new casts
  - Offline draft support

- [ ] **Analytics dashboard (Admin)**
  - Metrics: total casts, active users, credit volume
  - Charts: engagement over time, top skills, emerging topics
  - Export reports for stakeholder reviews

- [ ] **User activity tracking**
  - Cast attendance (join time, duration)
  - Popular skills (participant count)
  - Learner pathways (skill progression)

### Phase 4: Monetization & Community (Q4 2026)

- [ ] **Skill proficiency badges**
  - Award badges for expertise (earned after N casts created)
  - Display badges on profiles
  - Filter casts by instructor badges

- [ ] **Premium features**
  - Ad-free experience
  - Unlimited cast hosting
  - Advanced analytics for creators
  - Credential sharing (LinkedIn integration)

- [ ] **Creator tools**
  - Scheduling casts in advance
  - Invite-only private casts
  - Co-hosting (multiple presenters)
  - Attendee Q&A + polls during stream

- [ ] **Community features**
  - Skill rings (groups of learners + instructor)
  - Discussion forums per skill channel
  - Mentorship matching algorithm
  - Content moderation workflows

### Phase 5: Integration & Scale (2027+)

- [ ] **OAuth2 integrations**
  - SSO with corporate directories (Okta, Azure AD)
  - Sign in with Google/GitHub
  - SAML for enterprise SSO

- [ ] **LMS integration**
  - Display SkillCast casts in corporate LMS
  - Award certificates/credits to learning records
  - XAPI/Caliper event tracking

- [ ] **AI-powered features**
  - Auto-generated summaries from cast transcripts
  - Skill recommendation engine ("If you like React, try Next.js")
  - Spam detection for gratitude notes
  - Accessibility: auto-captions, transcripts

- [ ] **Internationalization (i18n)**
  - Multi-language UI (Spanish, French, Mandarin, etc.)
  - Timezone-aware cast scheduling
  - Regional skill taxonomies

### Technical Debt & Improvements

- [ ] **Testing**
  - Unit tests (Jest) for all controllers
  - E2E tests (Cypress) for critical flows
  - Performance benchmarks (Lighthouse)
  - Load testing (k6) for 10k+ concurrent users

- [ ] **DevOps & Infrastructure**
  - Docker containerization (backend + frontend)
  - Kubernetes deployment configs
  - CI/CD pipeline (GitHub Actions)
  - Automated backups + disaster recovery

- [ ] **Code quality**
  - TypeScript adoption (full type safety)
  - API documentation (OpenAPI/Swagger)
  - Design system documentation (Storybook)
  - Accessibility audit (WCAG 2.1 AA)

- [ ] **Performance optimization**
  - Database query optimization (EXPLAIN ANALYZE)
  - Image compression + CDN for avatars
  - Frontend code splitting + lazy loading
  - Caching strategy (Redis session store)

---

## Summary Table

| Aspect                   | Current              | Planned                        |
| ------------------------ | -------------------- | ------------------------------ |
| **Authentication**       | JWT + refresh tokens | OAuth2, SSO                    |
| **Real-time**            | Polling              | WebSockets, live notifications |
| **Media**                | Meeting links only   | Stream recording + replay      |
| **Users**                | Members only         | Skill badges, mentorship       |
| **Analytics**            | None                 | Full dashboard + export        |
| **Mobile**               | Responsive web       | Native iOS/Android app         |
| **Scale**                | Single region        | Multi-region, CDN              |
| **Testing**              | Manual               | 80%+ automated coverage        |
| **Internationalization** | English only         | 5+ languages, timezones        |

---

**Last Updated:** February 12, 2026  
**Maintainers:** SEB-60-Projects Team  
**Questions?** See README.md or contact team leads.
