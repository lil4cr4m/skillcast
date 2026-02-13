/**
 * SKILLCAST CAST FEED - Main Content Display Component
 *
 * This component manages the display of skill-sharing posts ("casts") in the main feed.
 * It handles data fetching, filtering, loading states, and real-time updates.
 *
 * KEY FEATURES:
 * 1. DYNAMIC DATA FETCHING - Loads casts from API with search/filter support
 * 2. REAL-TIME FILTERING - Responds to search queries and channel selection
 * 3. OPTIMISTIC UPDATES - Updates UI immediately when casts are modified
 * 4. LOADING STATES - Provides feedback during data operations
 * 5. EMPTY STATES - Encourages content creation when no casts exist
 * 6. RESPONSIVE GRID - Adapts layout for different screen sizes
 *
 * FILTERING CAPABILITIES:
 * - Search by title/description via searchQuery prop
 * - Filter by skill channel via selectedChannel prop
 * - Combines multiple filters for precise content discovery
 *
 * STATE MANAGEMENT:
 * - Local state for casts array and loading status
 * - Props-driven filtering updates trigger API refetch
 * - Parent component callbacks for cast updates/deletions
 *
 * REAL-TIME FEATURES:
 * - Automatic refetch when search/filter parameters change
 * - Optimistic UI updates when casts are modified
 * - Consistent loading and error state handling
 *
 * USAGE:
 * ```jsx
 * <CastFeed
 *   selectedChannel="programming"
 *   searchQuery="React"
 * />
 * ```
 *
 * TO EXTEND:
 * - Add pagination for large cast lists
 * - Implement infinite scroll or "Load More" functionality
 * - Add sorting options (date, popularity, credit)
 * - Integrate WebSocket for real-time updates
 * - Cache previous searches for better performance
 */

import React, { useEffect, useState } from "react";

// API CLIENT
// Configured axios instance with authentication headers
import api from "../../../shared/api/axios";

// CAST COMPONENTS
// Individual cast display component with interaction features
import CastCard from "./CastCard";

/**
 * CastFeed Component - Content Discovery & Display
 *
 * Props:
 * @param {string} selectedChannel - Filter casts by skill channel/category
 * @param {string} searchQuery - Filter casts by title/description text
 *
 * COMPONENT ARCHITECTURE:
 * - useEffect for data fetching with dependency on filter props
 * - useState for local state management (casts, loading)
 * - Callback props for child component communication
 * - Conditional rendering for loading/empty/populated states
 */
const CastFeed = ({ selectedChannel, searchQuery }) => {
  // 📋 CAST DATA STATE
  // Array of cast objects from the API
  const [casts, setCasts] = useState([]);

  // ⏳ LOADING STATE
  // Indicates when API request is in progress
  const [loading, setLoading] = useState(true);

  // 🔄 DATA FETCHING EFFECT
  // Triggers API call when component mounts or filter props change
  useEffect(() => {
    /**
     * Fetch Casts - API Data Retrieval
     *
     * FETCHING LOGIC:
     * 1. Set loading state to show user feedback
     * 2. Build query parameters from props
     * 3. Make API request with filters
     * 4. Update state with results or handle errors
     * 5. Clear loading state
     *
     * ERROR HANDLING:
     * - Network failures result in empty cast list
     * - User sees empty state rather than error message
     * - Graceful degradation maintains app functionality
     */
    const fetchCasts = async () => {
      setLoading(true);

      try {
        // 🔍 BUILD QUERY PARAMETERS
        // Only include parameters that have values
        const params = {};
        if (selectedChannel) params.channel = selectedChannel;
        if (searchQuery) params.q = searchQuery;

        // 📡 API REQUEST WITH FILTERS
        const res = await api.get("/casts", { params });

        // ✅ SUCCESS - UPDATE CAST LIST
        setCasts(res.data);
      } catch (err) {
        // ❌ ERROR - RESET TO EMPTY STATE
        console.error("Error fetching casts:", err);
        // Don't show error to user, just empty feed
        setCasts([]);
      } finally {
        // 🏁 ALWAYS CLEAR LOADING STATE
        setLoading(false);
      }
    };

    fetchCasts();

    // 🔗 DEPENDENCY ARRAY
    // Refetch data when search or channel filters change
  }, [selectedChannel, searchQuery]);

  /**
   * Cast Update Handler - Optimistic UI Updates
   *
   * When a cast is updated (edited, credit added, etc.), this function
   * immediately updates the local state to reflect the changes without
   * needing to refetch all data.
   *
   * @param {Object} updatedCast - Cast object with new data
   */
  const handleCastUpdate = (updatedCast) => {
    setCasts((prev) =>
      prev.map((c) => (c.id === updatedCast.id ? updatedCast : c)),
    );
  };

  /**
   * Cast Delete Handler - Remove from UI
   *
   * When a cast is deleted, immediately remove it from the UI
   * without waiting for a full data refresh.
   *
   * @param {string} castId - ID of the cast to remove
   */
  const handleCastDelete = (castId) => {
    setCasts((prev) => prev.filter((c) => c.id !== castId));
  };

  // ⏳ LOADING STATE DISPLAY
  // Shows animated loading message consistent with app's typography
  if (loading) {
    return (
      <div className="flex justify-center py-20 font-black italic text-violet animate-pulse text-xl">
        SYNCING_LIVE_CASTS...
      </div>
    );
  }

  // 📭 EMPTY STATE DISPLAY
  // Encourages content creation with neo-brutalist design
  if (!casts.length) {
    return (
      <div className="bg-white border-3 border-ink border-dashed rounded-3xl p-12 text-center shadow-brutal">
        <p className="font-black text-ink/80 uppercase tracking-widest mb-4">
          NO_LIVE_CASTS
        </p>
        <p className="text-ink font-bold italic underline decoration-violet decoration-4">
          BE_THE_FIRST_TO_CAST
        </p>
      </div>
    );
  }

  // 📋 CAST GRID DISPLAY
  // Responsive grid layout with consistent spacing
  return (
    <div className="grid grid-cols-1 gap-8">
      {casts.map((cast) => (
        <CastCard
          key={cast.id}
          cast={cast}
          onUpdate={handleCastUpdate} // Pass update handler for optimistic updates
          onDelete={handleCastDelete} // Pass delete handler for immediate UI update
        />
      ))}
    </div>
  );
};

export default CastFeed;
