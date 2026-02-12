/**
 * SKILLCAST ROUTE PROTECTION - Authentication Guard Component
 *
 * This is a Higher-Order Component (HOC) that wraps protected routes to ensure
 * only authenticated users can access certain pages/features.
 *
 * KEY FEATURES:
 * 1. AUTHENTICATION CHECK - Verifies user is logged in via AuthContext
 * 2. LOADING STATES - Shows spinner during initial auth verification
 * 3. REDIRECT HANDLING - Saves intended destination for post-login redirect
 * 4. SECURITY ENFORCEMENT - Prevents unauthorized access to sensitive routes
 * 5. USER EXPERIENCE - Seamless navigation flow with proper loading states
 *
 * PROTECTION FLOW:
 * 1. Check if auth verification is still loading → Show loading spinner
 * 2. Check if user is authenticated → Allow access to protected content
 * 3. If not authenticated → Redirect to login with return URL saved
 * 4. After login → User returns to originally intended page
 *
 * USAGE IN ROUTING:
 * ```jsx
 * <Route path="/create" element={
 *   <Protected>
 *     <CreateCast />
 *   </Protected>
 * } />
 * ```
 *
 * USAGE PATTERNS:
 * - Wrap any component that requires authentication
 * - Can nest multiple protected components
 * - Works with React Router's navigation system
 * - Maintains consistent UX across protected routes
 *
 * SECURITY CONSIDERATIONS:
 * - Only provides client-side route protection
 * - Backend APIs must still verify authentication
 * - Tokens validated on each API request
 * - No sensitive data should be accessible without server verification
 *
 * ACCESSIBILITY:
 * - Loading spinner has proper animations
 * - Screen readers can understand navigation flow
 * - No flash of protected content before redirect
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// AUTHENTICATION CONTEXT
// Access global user state and loading status
import { useAuth } from "../../features/auth/context/AuthContext";

/**
 * Protected Route Component - Authentication Gate
 *
 * This component implements the "guard" pattern for route protection.
 * It checks authentication state and either renders children or redirects.
 *
 * Props:
 * @param {React.ReactNode} children - The protected content to render if authenticated
 *
 * COMPONENT LOGIC:
 * 1. Get auth state (user, loading) from AuthContext
 * 2. Get current location for redirect purposes
 * 3. Render loading state while checking authentication
 * 4. Redirect to login if not authenticated
 * 5. Render protected content if authenticated
 */
const Protected = ({ children }) => {
  // 🔐 AUTHENTICATION STATE
  const { user, loading } = useAuth();

  // 📍 CURRENT LOCATION
  // Capture where user was trying to go for post-login redirect
  const location = useLocation();

  // ⏳ LOADING STATE - AUTH VERIFICATION IN PROGRESS
  // Show loading spinner while AuthContext determines authentication status
  // This prevents flash of login page during initial app load
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* 🌪️ NEO-BRUTALIST LOADING SPINNER */}
        {/* Consistent with app's bold visual style */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
      </div>
    );
  }

  // 🚫 NOT AUTHENTICATED - REDIRECT TO LOGIN
  if (!user) {
    // 💾 SAVE INTENDED DESTINATION
    // Pass current location in state so user can return here after login
    // replace: true prevents back button from returning to protected route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ AUTHENTICATED - RENDER PROTECTED CONTENT
  // User is logged in, safe to show the protected component(s)
  return children;
};

export default Protected;
