/**
 * SKILLCAST NAVIGATION - Main App Navigation Bar
 *
 * This is the primary navigation component that appears at the top of every page.
 * Provides authentication-aware navigation and role-based access controls.
 *
 * KEY FEATURES:
 * 1. AUTHENTICATION AWARENESS - Different nav items for logged in/out users
 * 2. ROLE-BASED ACCESS - Admin-only navigation items
 * 3. ACTIVE STATE INDICATORS - Visual highlighting of current page
 * 4. STICKY POSITIONING - Stays at top when scrolling
 * 5. RESPONSIVE DESIGN - Adapts to different screen sizes
 * 6. LOGOUT FUNCTIONALITY - Secure session termination
 *
 * NAVIGATION STRUCTURE:
 * - Brand Logo (always visible) → Links to Home
 * - Feed Link (always visible) → Main content page
 * - Profile Link (authenticated users) → User's own profile
 * - Admin Link (admin users only) → User management
 * - Logout Button (authenticated) / Login Button (unauthenticated)
 *
 * AUTHENTICATION STATES:
 * 1. UNAUTHENTICATED: Logo + Feed + Login Button
 * 2. REGULAR USER: Logo + Feed + Profile + Logout Button
 * 3. ADMIN USER: Logo + Feed + Profile + Admin + Logout Button
 *
 * VISUAL DESIGN:
 * - Neo-brutalist styling with heavy borders
 * - Brand typography (SKILLCAST with violet accent)
 * - Active link highlighting with underlines
 * - Consistent button styling via Button component
 *
 * ACCESSIBILITY:
 * - Semantic navigation element
 * - Keyboard navigation support
 * - Clear visual indicators for active states
 * - Icon + text labels for clarity
 *
 * TO EXTEND:
 * - Add search functionality
 * - Implement notification badges
 * - Add mobile menu for smaller screens
 * - Include user avatar/profile picture
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// AUTHENTICATION CONTEXT
// Access user state and logout functionality
import { useAuth } from "../../features/auth/context/AuthContext";

// UI COMPONENTS
// Consistent button styling across the app
import { Button } from "../ui/Button";

// ICONS
// Lucide React icons for visual navigation cues
import {
  LogOut, // Logout button icon
  LogIn, // Login button icon
  User as UserIcon, // Profile link icon
  Home as HomeIcon, // Feed/home link icon
  Settings as AdminIcon, // Admin section icon
} from "lucide-react";

/**
 * Navbar Component - Main Application Navigation
 *
 * RESPONSIVE BEHAVIOR:
 * - Sticky positioning keeps nav visible during scroll
 * - Flexbox layout adapts to content width
 * - Text sizes and gaps adjust for mobile/desktop
 *
 * AUTHENTICATION INTEGRATION:
 * - Reads user state from AuthContext
 * - Dynamically shows/hides navigation items
 * - Handles logout with proper cleanup and redirect
 */
export const Navbar = () => {
  // 🗺️ NAVIGATION HOOKS
  const { pathname } = useLocation(); // Current route for active states
  const navigate = useNavigate(); // Programmatic navigation

  // 🔐 AUTHENTICATION STATE
  const { user, logout } = useAuth();

  /**
   * Logout Handler - Secure Session Termination
   *
   * LOGOUT FLOW:
   * 1. Call logout from AuthContext (clears tokens, user state)
   * 2. Navigate to login page
   * 3. Handle any errors gracefully
   */
  const handleLogout = async () => {
    try {
      // 🚪 LOGOUT VIA AUTH CONTEXT
      await logout();

      // 🧭 REDIRECT TO LOGIN
      navigate("/login");
    } catch {
      // 🛡️ FALLBACK - Force navigation even if logout API fails
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-offwhite border-b-3 border-ink p-4">
      {/* 🧭 MAIN NAVIGATION CONTAINER */}
      {/* Sticky positioning keeps navbar visible during scroll  */}
      {/* Heavy bottom border creates separation from page content */}
      {/* 📱 RESPONSIVE CONTENT WRAPPER */}
      {/* Max width prevents nav from becoming too wide on large screens */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* 🏷️ BRAND LOGO */}
        {/* Always visible, links to home page */}
        <Link
          to="/"
          className="text-3xl font-black italic tracking-tighter text-ink"
        >
          SKILL<span className="text-violet">CAST</span>
        </Link>

        {/* 🔗 NAVIGATION LINKS */}
        {/* Right-aligned navigation items with responsive spacing */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* 🏠 FEED LINK - Always visible */}
          <Link
            to="/"
            className={`font-black uppercase text-sm tracking-tight flex items-center gap-2 ${
              // 🎯 ACTIVE STATE STYLING
              pathname === "/"
                ? "text-violet underline decoration-4 underline-offset-4" // Active page
                : "hover:text-violet" // Hover state
            }`}
          >
            <HomeIcon size={16} /> Feed
          </Link>

          {/* ================ AUTHENTICATED USER NAVIGATION ================ */}
          {user ? (
            <>
              {/* 👤 PROFILE LINK - Links to user's own profile */}
              {/* Uses dynamic user.id from authentication context */}
              <Link
                to={`/profile/${user.id}`}
                className={`font-black uppercase text-sm tracking-tight flex items-center gap-2 ${
                  pathname === `/profile/${user.id}`
                    ? "text-violet underline decoration-4 underline-offset-4"
                    : "hover:text-violet"
                }`}
              >
                <UserIcon size={16} /> Profile
              </Link>

              {/* 🔒 ADMIN LINK - Only visible for admin users */}
              {/* Role-based access control */}
              {user.role === "admin" && (
                <Link
                  to="/admin/users"
                  className={`font-black uppercase text-sm tracking-tight flex items-center gap-2 ${
                    pathname === "/admin/users"
                      ? "text-violet underline decoration-4 underline-offset-4"
                      : "hover:text-violet"
                  }`}
                >
                  <AdminIcon size={16} /> Admin
                </Link>
              )}

              {/* 🚪 LOGOUT BUTTON */}
              <Button
                variant="cyan"
                className="py-2 text-xs px-4 shadow-brutal-sm"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              {/* ================ UNAUTHENTICATED USER NAVIGATION ================ */}
              {/* 🔑 LOGIN BUTTON - Directs to authentication page */}
              <Link to="/login">
                <Button
                  variant="cyan"
                  className="py-2 text-xs px-6 shadow-brutal-sm"
                >
                  <LogIn size={16} className="mr-1" /> Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
