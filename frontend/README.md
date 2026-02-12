# SkillCast Frontend

React + Vite web application for the SkillCast social learning platform with neo-brutalist design.

## Getting Started

### Installation

```bash
npm install
```

### Configuration

Create `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=SkillCast
```

### Running Development Server

```bash
npm run dev
```

Application runs on `http://localhost:5173`

### Building for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── app/                          # App-level components and styles
│   ├── App.jsx                   # Main app router and layout wrapper
│   ├── Home.jsx                  # Landing/home page
│   ├── main.jsx                  # React DOM render entry
│   └── index.css                 # Global styles and Tailwind imports
│
├── features/                     # Feature modules (organized by domain)
│   ├── auth/                     # Authentication feature
│   │   ├── pages/
│   │   │   └── Login.jsx         # Login page
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state
│   │   └── index.js              # Feature exports
│   │
│   ├── casts/                    # Cast/session management feature
│   │   ├── pages/
│   │   │   └── CreateCast.jsx    # Create new cast form
│   │   ├── components/
│   │   │   ├── CastCard.jsx      # Individual cast display card
│   │   │   ├── CastFeed.jsx      # List/feed of all casts
│   │   │   └── NotesForm.jsx     # Send appreciation note form
│   │   └── index.js              # Feature exports
│   │
│   └── users/                    # User management feature
│       ├── pages/
│       │   ├── Profile.jsx       # User profile view
│       │   ├── EditProfile.jsx   # Edit profile form
│       │   └── AdminUsers.jsx    # Admin user management panel
│       ├── components/
│       │   └── Leaderboard.jsx   # User leaderboard display
│       └── index.js              # Feature exports
│
├── shared/                       # Shared utilities and components
│   ├── api/
│   │   ├── axios.js              # HTTP client with JWT interceptors
│   │   └── index.js              # API exports
│   │
│   ├── layout/
│   │   ├── Navbar.jsx            # Top navigation component
│   │   ├── Protected.jsx         # Protected route wrapper
│   │   └── index.js              # Layout exports
│   │
│   └── ui/
│       ├── Button.jsx            # Reusable button component
│       └── index.js              # UI component exports
│
└── index.html                    # HTML entry point
```

---

## Components Guide

### Shared UI Components

#### Button

Reusable button with variants.

```jsx
import { Button } from "./shared/ui/Button";

<Button variant="pink" onClick={handleClick}>
  Click Me
</Button>;
```

**Variants:** `default`, `pink`, `ink`, `outline`, `danger`

#### Navbar

Top navigation with authentication display.

```jsx
import { Navbar } from "./shared/layout/Navbar";

<Navbar />; // Used in App.jsx, displays user info or login link
```

#### Protected

Route wrapper for authentication-protected pages.

```jsx
import { Protected } from "./shared/layout/Protected";

<Protected>
  <AdminUsers />
</Protected>;
```

---

## Features Overview

### Auth Feature (`/features/auth`)

**Purpose:** User authentication and login management

**Components/Pages:**

- `Login.jsx` - Login form page
- `AuthContext.jsx` - Global auth state (user, token, isAuthenticated)

**Key Functionality:**

- User registration and login
- Token storage and refresh handling
- Session management
- Protected route logic

**Usage:**

```jsx
import { useAuth } from "./features/auth/context/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  return <div>Welcome {user.name}</div>;
};
```

---

### Casts Feature (`/features/casts`)

**Purpose:** Display, create, and manage skill-sharing sessions

**Components/Pages:**

- `CreateCast.jsx` - Form to create new cast
- `CastCard.jsx` - Individual cast card with join and note buttons
- `CastFeed.jsx` - Grid/list of all available casts
- `NotesForm.jsx` - Form to send appreciation note to cast host

**Key Functionality:**

- List all casts with filtering
- Create new casts
- Send appreciation notes
- Join cast (external link)
- Edit/delete own casts (owner only)

**UI Features:**

- Live status indicator
- Creator info and credit display
- Meeting link button
- Note form with success confirmation

---

### Users Feature (`/features/users`)

**Purpose:** User profiles, leaderboard, and admin management

**Components/Pages:**

- `Profile.jsx` - User profile view with stats and received notes
- `EditProfile.jsx` - Edit user bio and profile info
- `AdminUsers.jsx` - Admin panel for managing all users
- `Leaderboard.jsx` - Community leaderboard ranked by credit

**Key Functionality:**

- View user profile with stats
- Edit own profile
- View received/sent notes
- Admin user management (role, status)
- Community leaderboard display

---

## State Management

### Auth Context

Global authentication state in `features/auth/context/AuthContext.jsx`.

```jsx
import { useAuth } from "./features/auth/context/AuthContext";

const { user, isAuthenticated, login, logout, register, token } = useAuth();
```

**Context provides:**

- `user` - Current authenticated user object
- `isAuthenticated` - Boolean auth status
- `token` - JWT access token
- `login()` - Login function
- `logout()` - Logout function
- `register()` - Registration function

### Local Component State

Components use `useState` for UI and form state:

```jsx
const [content, setContent] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [casts, setCasts] = useState([]);
```

---

## API Client Setup

The Axios instance in `shared/api/axios.js` provides:

- **JWT token injection** in request headers automatically
- **Auto-refresh** when access token expires
- **Request retry** on token refresh
- **Error handling** with consistent format
- **CORS** pre-configured for backend domain

**Usage:**

```javascript
import api from "./shared/api/axios";

// GET request
const { data } = await api.get("/casts");

// POST request
const { data } = await api.post("/notes", {
  cast_id: 5,
  content: "Great lesson!",
});

// PUT request
await api.put("/casts/1", {
  title: "Updated Title",
});

// DELETE request
await api.delete("/casts/1");
```

---

## Styling

### Tailwind CSS

All components use Tailwind utility classes. No custom CSS needed for most cases.

```jsx
<div className="mt-4 p-3 bg-pink/15 border-3 border-ink rounded-lg shadow-brutal">
  <h2 className="text-ink font-black text-lg uppercase">Title</h2>
</div>
```

### Color Palette

Neo-brutalist custom colors defined in `tailwind.config.js`:

| Color                | Usage                         | Hex     |
| -------------------- | ----------------------------- | ------- |
| `ink`                | Dark text, borders, primary   | #1a1a1a |
| `pink`               | Accent, highlights, secondary | #ff3bff |
| `white` / `offwhite` | Backgrounds, cards            | #ffffff |

### Utility Classes

```css
/* Borders - thick and bold */
border-3              /* 3px border width */
border-ink            /* Ink-colored border */
shadow-brutal         /* Hard drop shadow (no blur) */

/* Typography - heavy and impactful */
font-black            /* Extra bold weight (900) */
tracking-wide         /* Increased letter spacing */
text-ink/70           /* Opacity variation (70%) */
uppercase             /* All caps transformation */

/* Animations - bold transitions */
animate-in            /* Fade/scale entrance effect */
slide-in-from-top-2   /* Slide down entrance */
duration-300          /* 300ms animation duration */
```

---

## Common Patterns

### Protected Route

Only authenticated users can access:

```jsx
import { useAuth } from "./features/auth/context/AuthContext";

export const ProfilePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Profile />;
};
```

### Conditional Rendering

Show actions only to owner/admin:

```jsx
const { user } = useAuth();
const isOwner = user?.id === cast.creator_id;

<div>
  {isOwner && (
    <div className="space-y-2">
      <Button onClick={handleEdit}>Edit Cast</Button>
      <Button onClick={handleDelete} variant="danger">
        Delete
      </Button>
    </div>
  )}
</div>;
```

### Loading & Error States

Handle async operations gracefully:

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/casts");
      setCasts(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

if (loading) return <p>Loading...</p>;
if (error) return <p className="text-pink">{error}</p>;
if (!casts.length) return <p>No casts found</p>;

return <CastFeed casts={casts} />;
```

### Form Handling

Controlled form with validation:

```jsx
const [formData, setFormData] = useState({
  title: "",
  description: "",
});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/casts", formData);
    // Success - redirect or update state
  } catch (err) {
    setErrors(err.response.data.errors || {});
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
    />
    <Button type="submit">Create Cast</Button>
  </form>
);
```

---

## Authentication Flow

1. **Register:**
   - User fills registration form
   - Frontend sends POST to `/auth/register`
   - Receives JWT access token + refresh token
   - Stores tokens in localStorage (via API client)
   - Updates AuthContext
   - Redirects to dashboard

2. **Login:**
   - User enters credentials
   - POST to `/auth/login`
   - Stores tokens
   - Updates AuthContext
   - Redirects to dashboard

3. **Protected Routes:**
   - Check `isAuthenticated` from `useAuth()`
   - Redirect to login if not authenticated
   - Only show owner/admin controls if authorized

4. **Token Refresh (Automatic):**
   - Axios catches 401 error on expired token
   - Automatically sends refresh token
   - Gets new access token
   - Retries original request
   - User session continues seamlessly

---

## Development Workflow

### Add New Page

1. Create file in feature's `pages/` folder:

   ```jsx
   // features/casts/pages/CastDetail.jsx
   export const CastDetail = () => {
     return <div>Cast Detail Page</div>;
   };
   ```

2. Add route in `App.jsx`:

   ```jsx
   <Route path="/casts/:id" element={<CastDetail />} />
   ```

3. Update feature `index.js`:
   ```jsx
   export { CastDetail } from "./pages/CastDetail";
   ```

### Add New Component

1. Create file in feature's `components/` folder:

   ```jsx
   // features/casts/components/CastStats.jsx
   export const CastStats = ({ cast }) => {
     return (
       <div>
         {cast.title} - {cast.views} views
       </div>
     );
   };
   ```

2. Use in pages:

   ```jsx
   import { CastStats } from "../components/CastStats";

   export const CastDetail = ({ cast }) => {
     return <CastStats cast={cast} />;
   };
   ```

### Add New Feature

1. Create new folder in `features/`:

   ```
   features/notifications/
   ├── pages/
   └── components/
   ```

2. Create pages and components
3. Create `index.js` with exports
4. Add routes in `App.jsx`

---

## Environment Variables

| Variable          | Type   | Required | Default   | Notes                                                  |
| ----------------- | ------ | -------- | --------- | ------------------------------------------------------ |
| VITE_API_BASE_URL | string | Yes      | —         | Backend API base URL (e.g., http://localhost:5000/api) |
| VITE_APP_NAME     | string | No       | SkillCast | Application name shown in UI                           |

**Example `.env` for development:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=SkillCast
```

**Example `.env` for production:**

```env
VITE_API_BASE_URL=https://api.skillcast.com/api
VITE_APP_NAME=SkillCast
```

---

## Build & Deployment

### Build for Production

```bash
npm run build

# Output in dist/ folder ready for deployment
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Vite and deploys from `dist/` folder.

### Deploy to Netlify

```bash
npm run build

# Upload dist/ folder via Netlify dashboard or CLI
```

### Environment Variables in Production

1. Set `VITE_API_BASE_URL` to production API domain
2. Include in build process:
   ```bash
   VITE_API_BASE_URL=https://api.example.com npm run build
   ```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

ES2020+ JavaScript features are used (no legacy support).

---

## Performance

- **Code splitting** by feature with dynamic imports
- **Tree-shaking** of unused Tailwind utilities
- **Image optimization** with next/image or webp
- **Lazy loading** of pages with React.lazy()
- **Fast HMR** with Vite during development

---

## Accessibility (a11y)

- **Semantic HTML** elements throughout
- **ARIA labels** on interactive components
- **Color contrast** meets WCAG 2.0 AA standard
- **Keyboard navigation** fully supported
- **Alt text** on all images and icons

---

## Troubleshooting

### CORS Errors

```
Access-Control-Allow-Origin error
```

**Solution:**

- Check `VITE_API_BASE_URL` matches backend domain
- Verify backend CORS config includes frontend URL
- Check browser Network tab for actual request origin
- Clear browser cache and cookies

### 401 Unauthorized Errors

```
Token expired or invalid
```

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Re-login to get fresh tokens
- Check token expiry in backend `.env`
- Verify JWT_SECRET matches between frontend and backend

### Dependencies Not Installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Vite Development Server Issues

```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Clear Vite cache and restart
rm -rf .vite
npm run dev
```

### Styling Issues

- Check Tailwind config is correct
- Verify all custom colors are defined
- Use `@apply` directive for CSS classes if needed
- Clear browser cache (hard refresh: Cmd+Shift+R)

---

## Contributing

Follow these conventions when extending:

- **Feature folders** - Use feature-based organization
- **Naming** - Use PascalCase for components (UserCard.jsx)
- **Exports** - Update feature `index.js` with new components
- **Styling** - Prefer Tailwind utilities over custom CSS
- **State** - Use React hooks and context, avoid Redux
- **API calls** - Use shared axios instance with error handling
- **Comments** - Add JSDoc comments for complex functions

---

## Support

Refer to root `README.md` for general setup and troubleshooting.
