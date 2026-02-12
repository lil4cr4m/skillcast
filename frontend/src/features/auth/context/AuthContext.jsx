/**
 * SKILLCAST AUTHENTICATION SYSTEM - Global Auth Context
 *
 * This is the central authentication system that manages user state across the entire app.
 *
 * KEY FEATURES:
 * 1. JWT TOKEN MANAGEMENT - Handles access & refresh tokens
 * 2. PERSISTENT SESSIONS - Maintains login across browser sessions
 * 3. AUTOMATIC REFRESH - Silently refreshes expired tokens
 * 4. GLOBAL STATE - User data available to all components via useAuth()
 * 5. SECURITY - Properly clears tokens on logout
 *
 * AUTHENTICATION FLOW:
 * 1. User logs in → tokens stored in localStorage + user state set
 * 2. App reload → attempts to refresh token if available
 * 3. API calls → automatically include access token (via axios interceptor)
 * 4. Token refresh → happens automatically when access token expires
 * 5. Logout → clears all local storage and resets state
 *
 * SECURITY CONSIDERATIONS:
 * - Tokens stored in localStorage (consider httpOnly cookies for production)
 * - Refresh tokens have longer expiration than access tokens
 * - All auth API calls go through configured axios instance
 * - Graceful handling of network failures during refresh
 *
 * USAGE:
 * ```jsx
 * const { user, login, logout, loading } = useAuth();
 *
 * // Check if user is authenticated
 * if (user) { ... }
 *
 * // Access user data
 * const { username, role, credit } = user;
 *
 * // Login/logout actions
 * await login(email, password);
 * await logout();
 * ```
 *
 * TO EXTEND:
 * - Add role-based permission checks
 * - Implement password reset functionality
 * - Add user profile update methods
 * - Integrate with external auth providers (OAuth)
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// API CLIENT
// Configured axios instance with base URL and interceptors
// Automatically attaches auth tokens to requests
import api from "../../../shared/api/axios";

// Create authentication context - will be provided at app root level
const AuthContext = createContext(null);

/**
 * AuthProvider Component - Authentication State Manager
 *
 * Wraps the entire application to provide authentication state and methods.
 *
 * STATE MANAGEMENT:
 * - user: Current user object {id, username, email, role, credit} or null
 * - loading: Boolean indicating if initial auth check is in progress
 *
 * INITIALIZATION PROCESS:
 * 1. Check localStorage for existing user data
 * 2. If refresh token exists, attempt to refresh access token
 * 3. On success: continue with stored user data
 * 4. On failure: clear storage and set user to null
 * 5. Set loading to false when process completes
 *
 * Props:
 * @param {React.ReactNode} children - App components to wrap with auth context
 */
export const AuthProvider = ({ children }) => {
  // 👤 USER STATE
  // Null when not authenticated, user object when logged in
  const [user, setUser] = useState(null);

  // ⏳ LOADING STATE
  // True during initial auth check, prevents flash of login screen
  const [loading, setLoading] = useState(true);

  // 🔄 INITIALIZATION & TOKEN REFRESH
  // Runs once when app starts to restore user session
  useEffect(() => {
    // 💾 RESTORE USER FROM STORAGE
    // Get previously stored user data (if any)
    const storedUser = localStorage.getItem("user");
    const refreshToken = localStorage.getItem("refreshToken");

    // If we have user data, restore it immediately for fast UI
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 🔑 ATTEMPT TOKEN REFRESH
    // Try to refresh access token to ensure we're still authenticated
    const tryRefresh = async () => {
      // No refresh token = definitely not authenticated
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // 📡 REFRESH ACCESS TOKEN
        // Send refresh token to get new access token
        const res = await api.post("/auth/refresh", { token: refreshToken });

        // 💾 STORE NEW ACCESS TOKEN
        // Keep user logged in with fresh token
        localStorage.setItem("accessToken", res.data.accessToken);

        // User data already restored above, just need token
      } catch (err) {
        // 🧹 REFRESH FAILED - CLEAR EVERYTHING
        // Tokens are invalid/expired, force re-login
        localStorage.clear();
        setUser(null);
      } finally {
        // ✅ INITIALIZATION COMPLETE
        // App can now render normally
        setLoading(false);
      }
    };

    // Execute the refresh attempt
    tryRefresh();
  }, []); // Empty dependency array = run once on mount

  /**
   * Login Method - Authenticate user with email and password
   *
   * AUTHENTICATION FLOW:
   * 1. Send credentials to backend /auth/login endpoint
   * 2. Backend validates credentials and returns tokens + user data
   * 3. Store tokens and user data in localStorage
   * 4. Update React state with user data
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @throws {Error} Login API error (wrong credentials, network issues, etc.)
   */
  const login = async (email, password) => {
    try {
      // 📡 SEND LOGIN REQUEST
      const res = await api.post("/auth/login", { email, password });

      // 📦 EXTRACT RESPONSE DATA
      // Backend returns: { accessToken, refreshToken, user }
      const { accessToken, refreshToken, user: userPayload } = res.data;

      // 💾 PERSIST TO LOCAL STORAGE
      // Store tokens and user data for session persistence
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userPayload));

      // 🔄 UPDATE REACT STATE
      // Trigger re-render across app with user data
      setUser(userPayload);
    } catch (err) {
      // 🚫 LOGIN FAILED - Re-throw for component error handling
      throw err;
    }
  };

  /**
   * Logout Method - Clear user session and invalidate tokens
   *
   * LOGOUT FLOW:
   * 1. Attempt to invalidate refresh token on server (optional)
   * 2. Clear all local storage (tokens + user data)
   * 3. Reset user state to null
   * 4. App automatically redirects to public pages
   *
   * GRACEFUL FAILURE:
   * - If server logout fails, we still clear local data
   * - Prevents users from being stuck in logged-in state
   * - Security: always clear tokens even if server unreachable
   */
  const logout = async () => {
    // 🎟️ GET REFRESH TOKEN for server invalidation
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      // 📡 ATTEMPT SERVER LOGOUT
      // Tell server to invalidate the refresh token
      if (refreshToken) {
        await api.post("/auth/logout", { token: refreshToken });
      }
    } catch {
      // 🤷‍♀️ IGNORE SERVER LOGOUT FAILURES
      // Network issues shouldn't prevent local logout
      // User security is maintained by clearing local tokens
    } finally {
      // 🧹 ALWAYS CLEAR LOCAL DATA
      // This happens regardless of server response
      localStorage.clear(); // Remove all stored data
      setUser(null); // Reset user state to trigger re-render
    }
  };

  // 🎁 PROVIDE CONTEXT VALUE
  // Make auth state and methods available to all child components
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook - Access authentication context
 *
 * Custom hook that provides access to authentication state and methods.
 * Must be used within components wrapped by AuthProvider.
 *
 * RETURNS:
 * - user: Current user object or null
 * - setUser: Function to update user state (rarely used directly)
 * - login: Function to authenticate user
 * - logout: Function to clear user session
 * - loading: Boolean indicating if initial auth check is in progress
 *
 * USAGE:
 * ```jsx
 * const { user, login, logout, loading } = useAuth();
 *
 * if (loading) return <Spinner />;
 * if (!user) return <LoginForm onLogin={login} />;
 * return <Dashboard user={user} onLogout={logout} />;
 * ```
 *
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  // 🚫 DEVELOPMENT GUARD
  // Helpful error message if hook used incorrectly
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};

export default AuthContext;
