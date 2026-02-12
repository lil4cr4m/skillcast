/**
 * SKILLCAST HOME PAGE - Main Landing Experience
 *
 * This is the primary landing page that users see when they visit the app.
 *
 * LAYOUT ARCHITECTURE:
 * - 3-column responsive grid layout (collapses to single column on mobile)
 * - Left: User identity card with stats and create button
 * - Center: Live cast feed with search functionality
 * - Right: Leaderboard showing top-performing users
 *
 * KEY FEATURES:
 * 1. USER IDENTITY CARD - Shows role, username, credit balance, quick create access
 * 2. LIVE CAST FEED - Real-time posts with search/filter capabilities
 * 3. LEADERBOARD - Gamification element showing top users
 * 4. RESPONSIVE DESIGN - Mobile-first with progressive enhancement
 * 5. ACCESSIBILITY - ARIA labels and semantic HTML
 *
 * STATE MANAGEMENT:
 * - Uses AuthContext for user data (role, username, credit)
 * - Local state for search functionality
 * - Children components manage their own data fetching
 *
 * TO EXTEND THIS PAGE:
 * - Add new search filters or sorting options
 * - Integrate channel/category functionality
 * - Add analytics/insights widgets
 * - Implement real-time notifications
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

// CONTEXT & HOOKS
// Access global authentication state (user data, login status)
import { useAuth } from "../features/auth/context/AuthContext";

// FEATURE COMPONENTS
// CastFeed: Displays list of skill posts with interactions
import CastFeed from "../features/casts/components/CastFeed";
// Leaderboard: Shows top users by credit/activity
import Leaderboard from "../features/users/components/Leaderboard";

// SHARED UI COMPONENTS
// Button: Consistent button styling across the app
import { Button } from "../shared/ui/Button";

/**
 * Home Component - Main Landing Page
 *
 * RESPONSIVE GRID LAYOUT:
 * - Mobile: Single column, stacked vertically (identity → feed → leaderboard)
 * - Desktop: 3-column grid (3-6-3 proportions)
 * - Sticky sidebars on large screens for better UX
 *
 * STATE MANAGEMENT:
 * - user: Current user data from AuthContext
 * - activeChannel: Future feature for channel filtering (currently unused)
 * - searchQuery: Live search input for filtering casts
 */
const Home = () => {
  // 🔐 ACCESS GLOBAL USER STATE
  // Get current user info from authentication context
  // Provides: user object with {id, username, role, credit, etc.}
  const { user } = useAuth();

  // 📺 CHANNEL SELECTION (Future Feature)
  // Currently unused - planned for organizing casts by topic/skill
  const [activeChannel] = useState(null);

  // 🔍 SEARCH FUNCTIONALITY
  // Live search state for filtering the cast feed
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-layout mx-auto p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 🏗️ MAIN LAYOUT GRID */}
      {/* 12-column CSS Grid that adapts from 1 column (mobile) to 3 columns (desktop) */}
      {/* Layout proportions: Identity(3) + Feed(6) + Leaderboard(3) = 12 total */}

      {/* ==================== LEFT SIDEBAR: USER IDENTITY ==================== */}
      {/* 👤 IDENTITY COLUMN - User stats, role, and quick actions */}
      {/* RESPONSIVE BEHAVIOR: order-2 on mobile, order-1 on desktop */}
      {/* STICKY POSITIONING: Stays in view when scrolling on large screens */}
      <aside
        className="lg:col-span-3 lg:sticky lg:top-[6rem] space-y-6 order-2 lg:order-1"
        aria-label="User actions and stats"
      >
        {/* 🎨 IDENTITY CARD - Neo-brutalism design with heavy shadows and borders */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* 🏷️ USER HEADER - Role and username display */}
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            {/* Dynamic role display based on user permissions */}
            {user?.role === "admin" ? "ADMIN" : "USER"}
            {/* Username with fallback for non-authenticated users */}
            <span className="text-violet italic">
              {user?.username || "Guest"}
            </span>
          </h1>

          {/* 💰 CREDIT BALANCE - Gamification element showing user's earned credits */}
          <div className="bg-yellow border-4 border-black p-4 mb-4">
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-black/60">
              Total_Credit
            </p>
            {/* Large credit number for visual impact */}
            <p className="text-4xl font-black leading-none">
              {user?.credit || 0}
            </p>
          </div>

          {/* ✨ QUICK CREATE - Primary call-to-action for content creation */}
          <Link to="/create">
            <Button
              variant="neon"
              className="w-full py-4 text-lg text-center justify-center"
            >
              START_CASTING
            </Button>
          </Link>
        </div>
      </aside>

      {/* ==================== CENTER: MAIN CONTENT FEED ==================== */}
      {/* 📺 FEED COLUMN - Primary content area with cast posts */}
      {/* RESPONSIVE BEHAVIOR: order-1 on mobile, order-2 on desktop */}
      {/* Takes up 6/12 grid columns on desktop for optimal reading width */}
      <section className="lg:col-span-6 space-y-[2.5rem] order-1 lg:order-2">
        <section className="space-y-[1.5rem]">
          {/* 🔴 LIVE STATUS HEADER - Shows real-time activity indicator */}
          <div className="flex items-center justify-between mb-[0.5rem]">
            {/* Bold section title with neo-brutalist typography */}
            <h2 className="text-h2-m xl:text-h2-d font-black italic uppercase tracking-tighter leading-tight">
              LIVE_CASTS
            </h2>

            {/* 📡 LIVE INDICATOR - Animated dot to show real-time activity */}
            <div className="flex gap-[0.5rem] items-center">
              {/* Pulsing green dot animation */}
              <span className="w-3 h-3 rounded-full bg-green animate-pulse border-2 border-ink" />
              {/* Status label with micro-typography */}
              <span className="text-[0.6rem] xl:text-[0.625rem] font-black uppercase tracking-widest leading-none">
                Casting Now
              </span>
            </div>
          </div>

          {/* 🔍 SEARCH AND FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-[1rem] items-center">
            <div className="relative flex-1 w-full">
              {/* Search input with neo-brutalist styling */}
              {/* Custom Tailwind class for consistent input styling */}
              <input
                type="text"
                placeholder="SEARCH_FOR_CHANNELS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-brutal w-full pr-12"
              />
              {/* Search icon positioned absolutely inside input */}
              <Search className="absolute right-4 top-4 opacity-40" />
            </div>
          </div>

          {/* 📋 CAST FEED COMPONENT */}
          {/* Displays paginated list of skill posts with real-time updates */}
          {/* Passes down search query and channel selection for filtering */}
          {/* Future feature for channel filtering */}
          {/* Clean search input */}
          <CastFeed
            selectedChannel={activeChannel}
            searchQuery={searchQuery.trim()}
          />
        </section>
      </section>

      {/* ==================== RIGHT SIDEBAR: LEADERBOARD ==================== */}
      {/* 🏆 LEADERBOARD COLUMN - Gamification and social proof */}
      {/* RESPONSIVE BEHAVIOR: order-3 on both mobile and desktop */}
      {/* STICKY POSITIONING: Stays visible when scrolling */}
      <aside
        className="lg:col-span-3 lg:sticky lg:top-[6rem] order-3"
        aria-label="Top casters leaderboard"
      >
        {/* 🎨 LEADERBOARD CARD with yellow header and white content area */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* 🏷️ LEADERBOARD HEADER with bright yellow accent */}
          <div className="p-[1.5rem] border-b-4 border-black bg-yellow">
            <h2 className="text-[1.25rem] font-black uppercase tracking-tighter leading-none">
              Top_Casters
            </h2>
          </div>

          {/* 📊 LEADERBOARD CONTENT */}
          {/* min-w-0 prevents text overflow in the constrained sidebar */}
          <div className="min-w-0">
            {/* Leaderboard component handles user ranking and display */}
            <Leaderboard />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;
