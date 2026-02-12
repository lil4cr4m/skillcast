# SkillCast Backend API

RESTful API for the SkillCast platform built with Node.js, Express, and PostgreSQL.

## Getting Started

### Installation

```bash
npm install
```

### Configuration

Create `.env` file in the backend root:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/skillcast_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
NODE_ENV=production npm start
```

Server runs on `http://localhost:5001`

---

## Project Structure

```
backend/
├── database/                     # SQL migration and seed files
│   ├── schema.sql                # Main database schema
│   ├── 01_skills.sql             # Skills seed data
│   ├── 02_users.sql              # Users seed data
│   ├── 03_casts.sql              # Casts seed data
│   ├── 04_notes.sql              # Notes seed data
│   └── 05_admin.sql              # Admin seed data (optional)
│
├── src/
│   ├── app/                      # Application entry point
│   │   └── app.js                # Express app initialization and route setup
│   │
│   ├── features/                 # Feature modules (organized by domain)
│   │   ├── auth/                 # Authentication feature
│   │   │   ├── controllers/
│   │   │   │   └── authController.js     # Auth logic (register, login, refresh)
│   │   │   ├── routes/
│   │   │   │   └── authRoutes.js         # Auth endpoints
│   │   │   └── index.js          # Feature exports
│   │   │
│   │   ├── users/                # User management feature
│   │   │   ├── controllers/
│   │   │   │   └── userController.js     # User profile, leaderboard, admin ops
│   │   │   ├── routes/
│   │   │   │   └── userRoutes.js         # User endpoints
│   │   │   └── index.js          # Feature exports
│   │   │
│   │   ├── casts/                # Cast/session management feature
│   │   │   ├── controllers/
│   │   │   │   └── castController.js     # Cast CRUD operations
│   │   │   ├── routes/
│   │   │   │   └── castRoutes.js         # Cast endpoints
│   │   │   └── index.js          # Feature exports
│   │   │
│   │   ├── skills/               # Skill catalog feature
│   │   │   ├── controllers/
│   │   │   │   └── skillController.js    # Skill and user skill management
│   │   │   ├── routes/
│   │   │   │   └── skillRoutes.js        # Skill endpoints
│   │   │   └── index.js          # Feature exports
│   │   │
│   │   └── notes/                # Notes/gratitude feature
│   │       ├── controllers/
│   │       │   └── noteController.js     # Note CRUD and gratitude logic
│   │       ├── routes/
│   │       │   └── noteRoutes.js         # Note endpoints
│   │       └── index.js          # Feature exports
│   │
│   └── shared/                   # Shared utilities and middleware
│       ├── config/
│       │   ├── db.js              # PostgreSQL connection setup
│       │   └── index.js           # Config exports
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js   # JWT verification middleware
│       │   └── index.js            # Middleware exports
│       │
│       └── utils/
│           ├── logger.js           # Logging utility
│           └── index.js            # Utils exports
│
├── scripts/                      # Utility scripts
│   ├── seed-admin.js             # Admin account seeding
│   └── test-db.js                # Database connection test
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint           | Description          | Body                         | Returns                       | Auth |
| ------ | ------------------ | -------------------- | ---------------------------- | ----------------------------- | ---- |
| POST   | `/register`        | Register new user    | `{email, password, name}`    | `{token, refreshToken, user}` | No   |
| POST   | `/login`           | Login user           | `{email, password}`          | `{token, refreshToken, user}` | No   |
| POST   | `/refresh`         | Refresh access token | `{refreshToken}`             | `{token}`                     | Yes  |
| POST   | `/change-password` | Change user password | `{oldPassword, newPassword}` | `{message}`                   | Yes  |
| POST   | `/logout`          | Logout user          | None                         | `{message}`                   | Yes  |

**Status Codes:**

- `200` - Success
- `400` - Bad request / Validation error
- `401` - Unauthorized / Invalid credentials
- `409` - Conflict / Email already exists

**Example Request:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

### 👥 Users (`/api/users`)

| Method | Endpoint       | Description                | Params            | Body             | Returns                                          | Auth          |
| ------ | -------------- | -------------------------- | ----------------- | ---------------- | ------------------------------------------------ | ------------- |
| GET    | `/leaderboard` | Get users ranked by credit | `limit`, `offset` | None             | `[{id, username, name, credit, ...}]`            | Public        |
| GET    | `/profile/:id` | Get user profile           | `id`              | None             | `{id, username, name, email, bio, credit, role}` | Public        |
| PUT    | `/profile/:id` | Update user profile        | `id`              | `{name, bio}`    | `{message, user}`                                | Own Profile   |
| GET    | `/admin/all`   | Get all users (admin)      | `limit`, `offset` | None             | `[{...}]`                                        | Admin Only    |
| PUT    | `/admin/:id`   | Update user (admin)        | `id`              | `{role, status}` | `{message, user}`                                | Admin Only    |
| DELETE | `/:id`         | Delete user account        | `id`              | None             | `{message}`                                      | Owner / Admin |

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not owner/admin)
- `404` - User not found

---

### 📺 Casts (`/api/casts`)

| Method | Endpoint        | Description         | Params                                  | Body                                           | Returns                                                   | Auth          |
| ------ | --------------- | ------------------- | --------------------------------------- | ---------------------------------------------- | --------------------------------------------------------- | ------------- |
| GET    | `/`             | Get all casts       | `skill_id`, `status`, `limit`, `offset` | None                                           | `[{id, title, creator_id, username, skill, status, ...}]` | Public        |
| GET    | `/past/:userId` | Get user past casts | `userId`                                | None                                           | `[{id, title, skill_name, status: 'ARCHIVED', ...}]`      | Public        |
| POST   | `/`             | Create new cast     | None                                    | `{title, description, skill_id, meeting_link}` | `{id, ...cast}`                                           | Authenticated |
| PUT    | `/:id`          | Update cast         | `id`                                    | `{title, description, meeting_link, status}`   | `{message, cast}`                                         | Owner / Admin |
| DELETE | `/:id`          | Archive cast        | `id`                                    | None                                           | `{message, cast}`                                         | Owner / Admin |

**Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad request / Invalid skill
- `403` - Forbidden
- `404` - Cast not found

**Cast Status:**

- `LIVE` - Active/broadcasting cast (default when created), green animated dot
- `PAUSED` - Temporarily stopped cast (hidden from public feed, visible to creator/admin only)
- `ENDED` - Completed/inactive cast (red static dot, visible to all, can receive notes)
- `ARCHIVED` - Soft deleted cast (moved to past casts, not visible in main feed)

---

### 🎓 Skills (`/api/skills`)

| Method | Endpoint        | Description       | Params            | Body              | Returns                      | Auth          |
| ------ | --------------- | ----------------- | ----------------- | ----------------- | ---------------------------- | ------------- |
| GET    | `/`             | Get all skills    | `limit`, `offset` | None              | `[{id, name, channel}]`      | Public        |
| GET    | `/user/:userId` | Get user skills   | `userId`          | None              | `[{id, name, channel, ...}]` | Public        |
| POST   | `/add`          | Add skill to user | None              | `{skill_id}`      | `{message, skill}`           | Authenticated |
| POST   | `/`             | Create new skill  | None              | `{name, channel}` | `{id, name, channel}`        | Admin Only    |
| PUT    | `/:id`          | Update skill      | `id`              | `{name, channel}` | `{message, skill}`           | Admin Only    |
| DELETE | `/:id`          | Delete skill      | `id`              | None              | `{message}`                  | Admin Only    |

**Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Duplicate skill / Bad request
- `403` - Forbidden (not admin)
- `404` - Skill not found

**Channels (Skill Categories):**

- `TECHNOLOGY` - Programming, web development, etc.
- `DESIGN` - UI/UX, graphic design, etc.
- `ART` - Digital art, photography, etc.
- `LIFESTYLE` - Cooking, wellness, hobbies, etc.

---

### 💝 Notes (`/api/notes`)

| Method | Endpoint        | Description            | Params                      | Body                 | Returns                                                               | Auth           |
| ------ | --------------- | ---------------------- | --------------------------- | -------------------- | --------------------------------------------------------------------- | -------------- |
| GET    | `/user/:userId` | Get notes received     | `userId`, `limit`, `offset` | None                 | `[{id, content, sender_username, sender_id, cast_title, created_at}]` | Public         |
| GET    | `/sent`         | Get notes sent by user | `limit`, `offset`           | None                 | `[{id, content, cast_title, cast_id, created_at}]`                    | Authenticated  |
| POST   | `/`             | Send note to cast host | None                        | `{cast_id, content}` | `{message, note}`                                                     | Authenticated  |
| PUT    | `/:id`          | Update note            | `id`                        | `{content}`          | `{message, note}`                                                     | Sender / Admin |
| DELETE | `/:id`          | Delete note            | `id`                        | None                 | `{message}`                                                           | Sender / Admin |

**Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad request / Self-note attempt
- `403` - Forbidden / Fraud check
- `404` - Note/Cast not found

**Note Features:**

- Sends +10 credit to cast host automatically
- Prevents self-notes (anti-abuse check)
- Admin can override self-note restriction
- Immutable after certain period (except admin)

---

## Database Schema

### Tables

**users** - User accounts with authentication and social credit

```sql
- id (UUID) PRIMARY KEY
- username (VARCHAR) UNIQUE NOT NULL
- email (VARCHAR) UNIQUE NOT NULL
- password_hash (TEXT) NOT NULL
- name (VARCHAR)
- bio (TEXT)
- credit (INT) DEFAULT 0  -- Social currency
- role (VARCHAR) DEFAULT 'member'  -- 'member' or 'admin'
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

**skills** - Available skills catalog

```sql
- id (UUID) PRIMARY KEY
- name (VARCHAR) UNIQUE NOT NULL
- channel (VARCHAR) NOT NULL  -- Category
```

**casts** - Live skill-sharing sessions

```sql
- id (UUID) PRIMARY KEY
- creator_id (UUID) FOREIGN KEY → users
- skill_id (UUID) FOREIGN KEY → skills
- title (VARCHAR) NOT NULL
- description (TEXT)
- meeting_link (TEXT) NOT NULL
- status (VARCHAR) DEFAULT 'LIVE' CHECK (status IN ('LIVE', 'PAUSED', 'ENDED', 'ARCHIVED'))
- credit (INT) DEFAULT 0  -- Total credit received from notes
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

**notes** - Appreciation/gratitude notes

```sql
- id (UUID) PRIMARY KEY
- cast_id (UUID) FOREIGN KEY → casts
- sender_id (UUID) FOREIGN KEY → users
- content (TEXT) NOT NULL
- created_at (TIMESTAMPTZ)
```

**refresh_tokens** - Session persistence

```sql
- token (TEXT) PRIMARY KEY
- user_id (UUID) FOREIGN KEY → users
- expires_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
```

**Relationships:**

```
users (1) ──→ (M) casts (creator_id)
users (1) ──→ (M) notes (sender_id)
skills (M) ──→ (M) users (user_skills junction table - optional)
casts (1) ──→ (M) notes (cast_id)
```

---

## Authentication & Authorization

### JWT Token Flow

1. **Registration/Login**: Generate access token (15 min) + refresh token (7 days)
2. **Authenticated Request**: Send access token in `Authorization: Bearer <token>` header
3. **Token Expired**: Use refresh token to get new access token
4. **Refresh Expired**: Re-login required

### Middleware

**authMiddleware.js** - Verifies JWT and attaches user to request

```javascript
import { authenticateToken } from "../shared/middleware/authMiddleware.js";

// Protect a route
router.post("/create", authenticateToken, createCast);
```

### Role-Based Access Control

- **member** - Default user role, can create casts and send notes
- **admin** - Full system access, user management, skill catalog, can override rules

### Server-Side Authorization

All permission checks enforced in controllers (not just middleware):

```javascript
// Example: Only owner or admin can edit
const isOwner = cast.creator_id === req.user.id;
const isAdmin = req.user.role === "admin";

if (!isOwner && !isAdmin) {
  return res.status(403).json({ error: "Unauthorized" });
}
```

---

## Request/Response Examples

### Register User

**Request:**

```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com",
    "username": "john_doe",
    "name": "John Doe",
    "role": "member",
    "credit": 0
  }
}
```

### Create Cast

**Request:**

```bash
POST http://localhost:5001/api/casts
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "React Fundamentals Workshop",
  "description": "Learn React basics in 30 minutes",
  "skill_id": "550e8400-e29b-41d4-a716-446655440001",
  "meeting_link": "https://zoom.us/j/123456789"
}
```

**Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "skill_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "React Fundamentals Workshop",
  "description": "Learn React basics in 30 minutes",
  "meeting_link": "https://zoom.us/j/123456789",
  "status": "LIVE",
  "created_at": "2026-02-12T14:23:00.000Z",
  "updated_at": "2026-02-12T14:23:00.000Z"
}
```

### Send Note

**Request:**

```bash
POST http://localhost:5001/api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "cast_id": "550e8400-e29b-41d4-a716-446655440002",
  "content": "Amazing React workshop! Really clarified hooks for me."
}
```

**Response (201):**

```json
{
  "message": "Note sent! brutal_builder earned +10 Credit.",
  "note": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "cast_id": "550e8400-e29b-41d4-a716-446655440002",
    "sender_id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Amazing React workshop! Really clarified hooks for me.",
    "created_at": "2026-02-12T14:45:00.000Z"
  }
}
```

---

## Environment Variables Reference

| Variable             | Type   | Required | Default               | Notes                                    |
| -------------------- | ------ | -------- | --------------------- | ---------------------------------------- |
| PORT                 | number | No       | 5001                  | Server port                              |
| NODE_ENV             | string | No       | development           | development / production                 |
| DATABASE_URL         | string | Yes      | —                     | PostgreSQL connection string             |
| JWT_SECRET           | string | Yes      | —                     | Access token signing key (min 32 chars)  |
| JWT_REFRESH_SECRET   | string | Yes      | —                     | Refresh token signing key (min 32 chars) |
| ACCESS_TOKEN_EXPIRY  | string | No       | 15m                   | Format: "15m", "1h", etc.                |
| REFRESH_TOKEN_EXPIRY | string | No       | 7d                    | Format: "7d", "30d", etc.                |
| FRONTEND_URL         | string | No       | http://localhost:5173 | CORS allowed origin                      |

---

## Database Setup

### Initialize Database

```bash
# From backend directory
# 1. Create database
createdb skillcast_db

# 2. Run schema
psql skillcast_db < database/schema.sql

# 3. Run seeds (in order)
psql skillcast_db < database/01_skills.sql
psql skillcast_db < database/02_users.sql
psql skillcast_db < database/03_casts.sql
psql skillcast_db < database/04_notes.sql
psql skillcast_db < database/05_admin.sql

# 4. Verify
psql skillcast_db -c "\dt"
```

### Seed Data Includes

- 16 skills across 4 channels (Technology, Design, Art, Lifestyle)
- 7 demo users with various credit levels
- 6 sample casts with working meeting links
- 7 sample notes showing appreciation between users
- Test admin account

---

## Development & Debugging

### Enable Logging

All endpoints log requests and errors via `logger.js`:

```javascript
import { logError } from "../shared/utils/logger.js";

// In catch blocks
logError("functionName", err, { userId });
```

### Database Debugging

```bash
# Connect to database
psql skillcast_db

# List all tables
\dt

# View table schema
\d table_name

# Query data
SELECT * FROM users LIMIT 5;

# Check triggers
\dy
```

### API Testing

Use curl, Postman, or Thunder Client:

```bash
# Test server health
curl http://localhost:5001/health

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'

# Get casts (no auth required)
curl http://localhost:5001/api/casts

# Create cast (authentication required)
curl -X POST http://localhost:5001/api/casts \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Cast","description":"Test","skill_id":"...","meeting_link":"https://..."}'
```

### Common Issues

**Cannot connect to database:**

- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l | grep skillcast_db`

**JWT errors:**

- Verify JWT_SECRET is set in `.env`
- Check token expiry times in code
- Token format: `Bearer <token>` (with space)

**CORS errors:**

- Verify FRONTEND_URL in `.env` matches actual frontend domain
- Check `app.js` CORS configuration
- Ensure backend is running on correct port

**Port already in use:**

```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>
```

---

## Performance & Security

### Security Best Practices

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT secrets stored in environment variables
- ✅ CORS restricted to frontend domain only
- ✅ SQL injection prevention via parameterized queries (pg)
- ✅ XSS prevention via JSON responses
- ✅ Rate limiting recommended for production
- ✅ HTTPS enforced in production
- ✅ Helmet.js headers configuration

### Performance Optimization

- Database indexes on frequently queried columns (user_id, cast_id, creator_id)
- Connection pooling via pg (default 10 connections)
- Request pagination with limit/offset defaults
- JWT caching in memory (short-lived)

### Monitoring

Log file recommendations for production:

- Keep error logs separate from access logs
- Rotate logs to prevent disk space issues
- Monitor slow queries (> 1s)
- Alert on repeated 4xx/5xx errors

---

## Contributing

**Code Style:**

- Feature-based folder structure maintained
- Controllers contain business logic
- Routes contain endpoint definitions only
- Consistent error handling with try-catch
- JSDoc comments for complex functions

**Adding New Endpoint:**

1. Create controller in `features/[name]/controllers/`
2. Create route in `features/[name]/routes/`
3. Register route in `app.js`
4. Document in README (this file)

**Database Changes:**

1. Create new migration file in `database/`
2. Update schema.sql
3. Run migrations: `psql skillcast_db < database/new_file.sql`
4. Update this documentation

---

## Support

Refer to root `README.md` for general setup and frontend integration.

For API issues, check:

- `.env` configuration
- Database connection: `psql skillcast_db -c "SELECT 1"`
- Server logs in terminal
- Browser developer tools (Network tab)
