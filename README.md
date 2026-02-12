# SkillCast

**A neo-brutalist live casting platform for knowledge sharing, skill discovery, and gratitude-driven community engagement.**

## About SkillCast

SkillCast is an innovative community platform designed to democratize knowledge sharing and foster meaningful professional connections. Built with a bold neo-brutalist design aesthetic, SkillCast enables experts and learners to connect through live "casts" (video broadcasts) organized by skill channels.

**Core Functionality:**

- Launch and join live skill-sharing broadcasts with integrated meeting links
- Build social currency through a gamified "credit" system (gratitude notes)
- Discover expertise across diverse skill channels
- Compete on leaderboards and track your contribution to the community
- Manage user accounts and skill catalogs via admin panel

**Why SkillCast?** In traditional corporate and educational settings, knowledge often siloed within departments or institutions. SkillCast breaks these barriers by creating an open, engaging platform where anyone can broadcast their expertise and anyone can learn from peers. The gratitude-driven credit system encourages quality engagement and recognizes knowledge sharing as a valued contribution.

## Screenshot

[Screenshot/Demo Video Coming Soon - Live application showcasing the neo-brutalist design and core features]

## Getting Started

### Deployed Application

- **Live App:** [Deploy link to be added when available]

### Planning & Documentation

- **Project Planning:** [Link to planning materials (Figma, GitHub Projects, or planning docs)]
- **API Documentation:** See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete API reference, database schema, and component tree
- **Backend Repository:** Located in `/backend` folder - see [Backend README](./backend/README.md) or [Backend Details](#backend-architecture)

### Local Development Quickstart

**Prerequisites:**

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

**Installation & Setup:**

1. **Clone & install dependencies:**

   ```bash
   git clone https://github.com/SEB-60-Projects/skillcast.git
   cd skillcast
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Set up environment variables** (`backend/.env`):

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/skillcast
   JWT_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   PORT=5001
   ```

3. **Initialize database:**

   ```bash
   cd backend
   node test-db.js  # runs schema.sql and seed-admin.js
   ```

4. **Start development servers:**

   ```bash
   # Terminal 1: Backend API
   cd backend && npm run dev

   # Terminal 2: Frontend SPA
   cd frontend && npm run dev
   ```

5. **Access the application:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:5001
   - **Admin Credentials:** Email: `admin@skillcast.com` | Password: `AdminPass123!`

## Technologies Used

### Frontend

- **React 18** - UI library for component-based architecture
- **Vite** - Fast build tool and development server with HMR
- **Tailwind CSS 3** - Utility-first CSS framework with custom neo-brutalist design system
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Lucide React** - Icon library (minimalist, customizable SVG icons)
- **TailwindMerge** - Intelligent Tailwind class merging for dynamic styles

### Backend

- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Lightweight web framework for REST API
- **PostgreSQL** - Relational database for data persistence
- **JWT (jsonwebtoken)** - JSON Web Tokens for stateless authentication
- **bcrypt** - Password hashing and verification
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing for frontend-backend communication

### Design System

- **Neo-brutalism** - Bold, high-contrast design with:
  - 3px border-width (`border-3`)
  - Brutal shadow system (4px, 8px, 12px offsets)
  - Structured color palette (violet, yellow, pink, cyan, danger, neon, ink, offwhite)
  - -DEFAULT and -muted color variants for component states

### Development Tools

- **Git** - Version control
- **GitHub** - Repository hosting and collaboration

## Attributions

This project uses and builds upon the following open-source technologies and resources:

- **React** - Facebook/Meta (MIT License)
- **Tailwind CSS** - Tailwind Labs (MIT License)
- **Express.js** - OpenJS Foundation (MIT License)
- **PostgreSQL** - PostgreSQL Global Development Group (PostgreSQL License)
- **Lucide Icons** - Lucide Contributors (ISC License)
- **bcrypt** - NPM bcrypt contributors (MIT License)
- **Axios** - Matt Zabriskie and contributors (MIT License)
- **jsonwebtoken** - Auth0 (MIT License)

All attributions follow the MIT and equivalent open-source license requirements.

## Key Features

✅ **Authentication** – Register, login, refresh tokens, password management  
✅ **Live Casts** – Create skill-based broadcasts with meeting links  
✅ **Skill Catalog** – Admin-managed channel-organized skill taxonomy  
✅ **Gratitude System** – Send credit notes to cast creators (+10 credit per note)  
✅ **Leaderboard** – Rank users by total credit earned  
✅ **User Profiles** – View stats (casts created, notes received)  
✅ **Admin Panel** – Full user management (create, edit, delete, update role/credit)  
✅ **Role-Based Access** – Member vs Admin permissions

## Project Structure

```
skillcast/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── pages/           # Home, Login, Profile, CreateCast, AdminUsers
│   │   ├── components/      # UI components, CastFeed, CastCard, CreditForm
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── api/             # Axios instance & endpoints
│   │   └── App.jsx          # Router & layout
│   └── tailwind.config.js   # Color palette (#00FF85, #A358FF, etc.)
│
└── backend/                  # Node.js + Express + PostgreSQL
    ├── src/
    │   ├── controllers/      # Business logic (auth, users, casts, skills)
    │   ├── routes/          # API endpoints
    │   ├── middleware/      # JWT auth, error handling
    │   ├── config/          # Database connection
    │   └── utils/           # Logger, helpers
    ├── db/                  # SQL migrations & schema
    └── seed-admin.js        # Admin account seeder
```

## Color Palette

**WCAG AA Compliant** - All colors meet 4.5:1 contrast ratio requirements for accessibility.

| Name       | Hex       | Usage                                     |
| ---------- | --------- | ----------------------------------------- |
| Violet     | `#6D28D9` | Primary brand, admin badges, main CTAs    |
| Yellow     | `#B45309` | Credit system, attention-getting elements |
| Neon Green | `#166534` | LIVE status, high-priority actions        |
| Pink       | `#9D174D` | User highlights, destructive actions      |
| Cyan       | `#0E7490` | Secondary actions, utility buttons        |
| Danger Red | `#7F1D1D` | Delete, logout, critical warnings         |
| Ink Black  | `#1a1a1a` | Borders, shadows, primary text            |
| Off-White  | `#ffffff` | Canvas background, button text            |

## API Overview

See [DOCUMENTATION.md](DOCUMENTATION.md) for complete reference:

- Database schema with types and constraints
- Entity relationship diagram
- All API endpoints with request/response examples
- React component tree
- Detailed feature descriptions

**Quick API Examples:**

- `POST /api/auth/register` – Create account
- `POST /api/auth/login` – Sign in
- `POST /api/casts` – Launch cast
- `GET /api/casts` – List casts
- `POST /api/notes` – Send gratitude
- `GET /api/users/leaderboard` – Top 10 users
- `GET /api/users/admin/all` – All users (admin)
- `DELETE /api/users/:id` – Delete user (admin)

## Development

### Code Standards

- **Frontend:** React hooks, context API, Tailwind classes
- **Backend:** Async/await, prepared SQL statements, centralized error handling
- **Naming:** camelCase (JS), UPPERCASE (UI text), snake_case (db)

### Running Tests

```bash
cd backend
npm test  # Run Jest tests (when configured)
```

### Debugging

- Frontend: Open DevTools (F12), check Console/Network tabs
- Backend: Check terminal output for logs
- Database: Use `psql` CLI or GUI (pgAdmin, DataGrip, DBeaver)

## Features Explained

### Authentication

- Secure password hashing (bcrypt, 12 rounds)
- JWT access tokens (15 min expiry)
- Long-lived refresh tokens (7 days)
- Auto-logout on both token expiration and manual logout
- Token revocation on password change

### Live Casts

- Create broadcast with skill, title, description, Zoom/Teams link
- Join via external meeting link
- Filter by skill channel
- Search by title/keywords
- Cast status management (LIVE, PAUSED, ENDED, ARCHIVED)
- Owner can edit, end, or archive cast
- Soft delete with archive functionality preserves cast history
- Unarchive past casts to restore them to LIVE status
- Visual status indicators (green animated dot for LIVE, red static for ENDED)

### Gratitude System

- Attendees send gratitude notes (+10 credit to creator)
- Self-gratitude prevention
- Public visibility of notes on cast details
- Creator sees accumulated credit on profile

### Leaderboard

- Top 10 users ranked by total credit
- Real-time updates as notes are sent
- Display on home page sidebar
- Encourages healthy competition

### Admin Panel

- View all users in database
- Create new user accounts
- Edit user details (name, credit, role)
- Delete user accounts with confirmation
- Manage skill catalog (CRUD)

## Presentation Highlights

**For Stakeholders:**

- 🎨 Modern, bold neo-brutalist design with intentional aesthetic
- 💪 Complete CRUD operations with role-based security
- 🏆 Gamified engagement (credit system, leaderboard)
- 📊 Scalable architecture (UUID keys, stateless auth)
- 🔒 Enterprise-ready security (bcrypt, JWT, HTTPS-ready)

**For Developers:**

- ⚡ Fast dev setup with Vite + Tailwind hot reload
- 🧩 Modular React architecture (hooks, context, components)
- 📚 Well-organized backend (controllers, routes, middleware)
- 🗄️ Clean database schema with relationships documented
- 📖 Comprehensive API documentation (DOCUMENTATION.md)

## Next Steps & Roadmap

### Short-term Enhancements (Q2 2026)

- Real-time notifications using WebSocket technology
- Advanced search and filtering capabilities by skill, date, and popularity
- Cast recording and replay functionality for asynchronous learning
- Email notifications for cast invitations and new followers

### Mid-term Features (Q3-Q4 2026)

- Native mobile application (React Native for iOS/Android)
- Admin analytics dashboard with engagement metrics
- Skill proficiency badges and certifications
- Premium subscription tier with exclusive features
- Automated cast scheduling and recurring sessions

### Long-term Vision (2027+)

- OAuth2 and SSO integration for enterprise deployments
- Learning Management System (LMS) connectivity
- AI-powered skill recommendations and matching
- Internationalization (i18n) for global audiences
- Machine learning insights for career development

See [DOCUMENTATION.md](./DOCUMENTATION.md) for technical debt items, known limitations, and detailed implementation roadmap.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "feat: describe change"`
4. Push and open a pull request

## Support

- **Issues:** GitHub Issues
- **Questions:** DM maintainers or check team Slack
- **Full Docs:** See [DOCUMENTATION.md](DOCUMENTATION.md) for API, database schema, component tree, and roadmap

## License

MIT – See LICENSE file for details

---

**Last Updated:** February 12, 2026  
**Built by:** SEB-60-Projects Team
