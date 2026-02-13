/**
 * SKILLCAST FRONTEND - Main Application Component
 *
 * This is the core component that sets up the entire application architecture.
 *
 * KEY FEATURES:
 * 1. Authentication Context - Provides user state throughout the app
 * 2. React Router - Handles client-side navigation
 * 3. Protected Routes - Restricts access to authenticated users
 * 4. Role-based Access - Admin-only routes for user management
 * 5. Responsive Layout - Mobile-first design with Tailwind CSS
 *
 * ARCHITECTURE PATTERN:
 * - Feature-based folder structure (/features/auth, /features/casts, etc.)
 * - Shared components in /shared (UI components, layout, API)
 * - Context providers at the top level for global state
 *
 * ROUTING STRUCTURE:
 * - Public: Home, Login, Public Profiles
 * - Protected: Create Cast, Profile Settings
 * - Admin: User Management
 *
 * TO ADD NEW FEATURES:
 * 1. Create feature folder in /src/features/
 * 2. Add route in this component
 * 3. Wrap in <Protected> if authentication required
 * 4. Import and configure any new context providers
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// CONTEXT & SECURITY
// AuthProvider: Manages user authentication state across the app
import { AuthProvider } from "../features/auth/context/AuthContext";
// Protected: Higher-order component for route protection
import Protected from "../shared/layout/Protected";

// LAYOUT COMPONENTS
// Navbar: Main navigation bar with user controls
import Navbar from "../shared/layout/Navbar";

// PAGE COMPONENTS - Organized by feature
import Home from "./Home"; // Landing page with feed
import Login from "../features/auth/pages/Login"; // User authentication
import Profile from "../features/users/pages/Profile"; // Public user profiles
import EditProfile from "../features/users/pages/EditProfile"; // User settings
import CreateCast from "../features/casts/pages/CreateCast"; // Create new skill posts
import AdminUsers from "../features/users/pages/AdminUsers"; // Admin user management
import AdminSkills from "../features/skills/pages/AdminSkills"; // Admin skill management
/**
 * Main App Component - Application Entry Point
 *
 * PROVIDER HIERARCHY:
 * 1. AuthProvider - Manages authentication state globally
 * 2. Router - Enables client-side navigation
 * 3. Layout - Consistent page structure with navbar and main content
 *
 * LAYOUT STRUCTURE:
 * - Min height viewport for full-screen coverage
 * - Centered content with max-width constraints
 * - Responsive padding that adapts to screen size
 * - Tailwind custom color classes (offwhite background)
 */
function App() {
  return (
    // 🔐 AUTHENTICATION PROVIDER
    // Wraps entire app to provide user state, login/logout functions
    // All child components can access auth state via useAuth() hook
    <AuthProvider>
      {/* 🧭 ROUTER SETUP */}
      {/* BrowserRouter enables client-side routing with clean URLs */}
      <Router>
        {/* 🎨 MAIN LAYOUT CONTAINER */}
        <div className="min-h-screen bg-offwhite">
          {/* 🧭 NAVIGATION BAR */}
          {/* Navbar has access to auth state since it's inside AuthProvider */}
          <Navbar />

          {/* 📱 RESPONSIVE MAIN CONTENT */}
          {/* Progressive padding: 4px mobile → 6px tablet → 10px desktop */}
          {/* Progressive spacing: 8px mobile → 10px desktop vertical */}
          <main className="max-w-layout mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
            {/* 🛤️ APPLICATION ROUTES */}
            <Routes>
              {/* ================== PUBLIC ROUTES ================== */}
              {/* Anyone can access these routes without authentication */}

              {/* 🏠 HOME PAGE - Main landing with cast feed and leaderboard */}
              <Route path="/" element={<Home />} />

              {/* 🔑 LOGIN PAGE - User authentication */}
              <Route path="/login" element={<Login />} />

              {/* 👤 PUBLIC PROFILES - View other users' profiles */}
              <Route path="/profile/:id" element={<Profile />} />

              {/* ⚙️ PROFILE SETTINGS - Edit own profile (should be protected) */}
              <Route path="/settings/profile" element={<EditProfile />} />

              {/* ================ PROTECTED ROUTES ================= */}
              {/* Only authenticated users can access these routes */}

              {/* ✨ CREATE CAST - Post new skill content */}
              <Route
                path="/create"
                element={
                  <Protected>
                    <CreateCast />
                  </Protected>
                }
              />

              {/* =================== ADMIN ROUTES ================== */}
              {/* Only users with admin role can access these routes */}

              {/* 👥 USER MANAGEMENT - Admin dashboard for managing users */}
              <Route
                path="/admin/users"
                element={
                  <Protected>
                    <AdminUsers />
                  </Protected>
                }
              />

              {/* 🎓 SKILL MANAGEMENT - Admin dashboard for managing skills */}
              <Route
                path="/admin/skills"
                element={
                  <Protected>
                    <AdminSkills />
                  </Protected>
                }
              />

              {/* ==================== 404 FALLBACK =================== */}
              {/* Catch-all route for undefined URLs */}
              {/* Uses path="*" to match any unmatched route */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center py-20">
                    {/* 🎨 Neo-brutalism 404 design with bold typography */}
                    <h1 className="text-6xl font-black text-violet">
                      ERROR_404
                    </h1>
                    <p className="text-ink/60 mt-4 font-bold uppercase text-xs tracking-widest">
                      FEED_NOT_FOUND: ROUTE_BACK_TO_LIVE_CASTS.
                    </p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
