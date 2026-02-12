# SkillCast Backend

This folder contains the Express.js + PostgreSQL REST API for SkillCast, a neo-brutalist live casting platform for knowledge sharing and skill discovery.

## Quick Links

- **Frontend Repository & Full Project Details:** https://github.com/SEB-60-Projects/skillcast
- **API Endpoints & Documentation:** See [DOCUMENTATION.md](../DOCUMENTATION.md) in the root directory for complete API reference, database schema, and architecture

## Architecture Overview

**Backend Stack:**

- Node.js with Express.js web framework
- PostgreSQL relational database
- JWT-based stateless authentication with refresh tokens
- bcrypt password hashing
- RESTful API design patterns

**Key Capabilities:**

- User authentication and authorization (register, login, refresh tokens, role-based access)
- Live cast management (create, read, update, delete broadcasts with meeting links)
- Skill catalog management with administrative controls
- Gratitude/credit system (gratitude notes and point accumulation to users)
- User profile data and gamified leaderboard functionality
- Admin panel with full user account management

## Getting Started with the Backend

See the main [README.md](../README.md) in the skillcast root directory for complete setup instructions including database initialization.

**Quick start:**

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5001`

**Test Admin Account:**

- Email: `admin@skillcast.com`
- Password: `AdminPass123!`

For comprehensive project details, setup instructions, and API documentation, see the [SkillCast Frontend Repository](https://github.com/SEB-60-Projects/skillcast)
