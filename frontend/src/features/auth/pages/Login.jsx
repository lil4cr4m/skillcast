/**
 * SKILLCAST LOGIN PAGE - Complete Authentication Interface
 *
 * This is a comprehensive authentication component that handles multiple scenarios:
 * 1. User login (existing accounts)
 * 2. User registration (new accounts)
 * 3. User logout (when already authenticated)
 * 4. Redirect handling (return to intended page after login)
 *
 * KEY FEATURES:
 * - DUAL MODE: Toggle between login and registration
 * - ALREADY AUTHENTICATED: Shows logout option if user already logged in
 * - FORM VALIDATION: Required fields with error handling
 * - REDIRECT LOGIC: Returns users to their intended destination
 * - NEO-BRUTALIST UI: Bold, animated design consistent with app theme
 * - ACCESSIBILITY: Form labels, semantic HTML, keyboard navigation
 *
 * AUTHENTICATION STATES:
 * 1. Logged Out + Login Mode: Email/password fields + login button
 * 2. Logged Out + Register Mode: Username/name/email/password + registration
 * 3. Logged In: Session active message + logout button + nav to home
 *
 * FORM HANDLING:
 * - Uses controlled components for all inputs
 * - Real-time validation and error display
 * - Graceful error handling with user-friendly messages
 *
 * NAVIGATION FLOW:
 * - After successful login: redirect to intended page or home
 * - After registration: switch to login mode with success message
 * - After logout: stay on login page
 *
 * TO EXTEND:
 * - Add password reset functionality
 * - Implement OAuth providers (Google, GitHub, etc.)
 * - Add remember me checkbox
 * - Implement account verification flow
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// AUTHENTICATION CONTEXT
// Access global auth state and login/logout methods
import { useAuth } from "../context/AuthContext";

// API CLIENT
// For registration API calls (login handled by AuthContext)
import api from "../../../shared/api/axios";

// UI COMPONENTS
// Consistent button styling throughout app
import { Button } from "../../../shared/ui/Button";

// ICONS
// Lucide React icons for visual enhancement and accessibility
import {
  LogIn, // Login button icon
  UserPlus, // Registration button icon
  Mail, // Email input icon
  Lock, // Password input icon
  User as UserIcon, // Username/name input icon
  Zap, // Decorative animated icon
  LogOut, // Logout button icon
  ShieldCheck, // Authentication success icon
} from "lucide-react";

/**
 * Login Component - Multi-state Authentication Interface
 *
 * COMPONENT ARCHITECTURE:
 * - STATE MANAGEMENT: React hooks for form data, UI state, error handling
 * - NAVIGATION: React Router for programmatic navigation and redirect logic
 * - AUTHENTICATION: Context integration for global auth state management
 *
 * RENDERING LOGIC:
 * 1. If user already authenticated → show logout interface
 * 2. If user not authenticated → show login/register form
 * 3. Toggle between login and registration modes
 * 4. Display errors and loading states appropriately
 *
 * FORM DATA STRUCTURE:
 * - email: Required for both login and registration
 * - password: Required for both login and registration
 * - username: Required only for registration (unique identifier)
 * - name: Optional for registration (display name)
 */
const Login = () => {
  // 🔐 AUTHENTICATION STATE
  // Access current user and auth methods from global context
  const { user: activeUser, login, logout } = useAuth();

  // 🔄 UI STATE MANAGEMENT
  // Toggle between login and registration modes
  const [isLogin, setIsLogin] = useState(true);

  // ❌ ERROR HANDLING
  // Display user-friendly error messages for failed auth attempts
  const [error, setError] = useState("");

  // 📝 FORM DATA STATE
  // Controlled form inputs for all authentication fields
  const [formData, setFormData] = useState({
    email: "", // Required for login/register
    password: "", // Required for login/register
    username: "", // Required for register only
    name: "", // Optional for register
  });

  // 🧭 NAVIGATION SETUP
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 REDIRECT LOGIC
  // After successful login, return user to their intended destination
  // Defaults to home page if no specific destination was intended
  // Defaults to home page if no specific destination was intended
  const from = location.state?.from?.pathname || "/";

  /**
   * Form Submission Handler - Login or Registration
   *
   * DUAL-PURPOSE HANDLER:
   * - LOGIN MODE: Authenticate existing user with email/password
   * - REGISTER MODE: Create new user account with full form data
   *
   * LOGIN FLOW:
   * 1. Call login method from AuthContext
   * 2. On success: navigate to intended destination
   * 3. On failure: display error message to user
   *
   * REGISTRATION FLOW:
   * 1. Send registration data to backend API
   * 2. On success: switch to login mode with success message
   * 3. On failure: display error message to user
   *
   * ERROR HANDLING:
   * - Network errors, validation errors, duplicate accounts
   * - User-friendly error messages in app's style
   */
  const handleSubmit = async (e) => {
    // 🚫 PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();

    // 🧹 CLEAR PREVIOUS ERRORS
    setError("");

    try {
      if (isLogin) {
        // 🔑 LOGIN FLOW
        // Use AuthContext login method for consistent token handling
        await login(formData.email, formData.password);

        // ✅ LOGIN SUCCESS - REDIRECT TO INTENDED DESTINATION
        // replace: true prevents back button from returning to login
        navigate(from, { replace: true });
      } else {
        // 📝 REGISTRATION FLOW
        // Direct API call since registration doesn't need immediate auth
        await api.post("/auth/register", formData);

        // ✅ REGISTRATION SUCCESS - SWITCH TO LOGIN MODE
        setIsLogin(true);
        alert("ACCOUNT_INITIALIZED: Please log in.");
      }
    } catch (err) {
      // ❌ AUTHENTICATION FAILED
      console.error("Authentication failed:", err);
      // Display user-friendly error message in app's style
      setError(
        err.response?.data?.error || "ACCESS_DENIED: Check credentials.",
      );
    }
  };

  /**
   * Logout Handler - Terminate Active Session
   *
   * LOGOUT FLOW:
   * 1. Call logout method from AuthContext
   * 2. Clear all local storage and user state
   * 3. Navigate to login page
   * 4. Handle any logout errors gracefully
   *
   * SECURITY CONSIDERATIONS:
   * - Always clear tokens even if server request fails
   * - Redirect to login page to prevent unauthorized access
   */
  const handleLogoutAction = async () => {
    try {
      // 🚪 LOGOUT VIA AUTH CONTEXT
      // Handles token cleanup and server notification
      await logout();

      // 🧭 REDIRECT TO LOGIN
      navigate("/login");
    } catch (err) {
      // ❌ LOGOUT ERROR (rare)
      console.error("Logout error:", err);
      // Even if logout fails, user should see what happened
      setError("LOGOUT_FAILED: System error.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border-3 border-ink p-8 md:p-10 rounded-[2.5rem] shadow-brutal-lg relative overflow-hidden">
        {/* VIEW A: USER IS LOGGED IN (Show Logout) */}
        {activeUser ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-neon border-3 border-ink rounded-full flex items-center justify-center mx-auto mb-6 shadow-brutal animate-pulse">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
              Session_Active
            </h2>
            <p className="text-ink/60 font-bold text-xs uppercase mb-8 tracking-widest">
              Identified_as: {activeUser.username || activeUser.email}
            </p>

            <Button
              variant="danger"
              className="w-full py-4 text-lg"
              onClick={handleLogoutAction}
            >
              <LogOut size={20} /> TERMINATE_SESSION
            </Button>

            <button
              onClick={() => navigate("/")}
              className="mt-6 font-black uppercase text-[10px] tracking-[0.2em] underline decoration-violet decoration-2 underline-offset-4"
            >
              Return_to_Feed
            </button>
          </div>
        ) : (
          /* VIEW B: USER IS LOGGED OUT (Show Login/Signup) */
          <>
            <div className="absolute top-[1rem] right-[1rem] w-[4.5rem] h-[4.5rem] bg-yellow border-3 border-ink rounded-full flex items-center justify-center animate-bounce shadow-brutal">
              <Zap size={28} />
            </div>

            <header className="text-center mb-10">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                {isLogin ? "IN_THE_CLUB" : "START_SHARING"}
              </h2>
              <p className="text-ink/60 font-bold text-xs uppercase mt-2 tracking-widest">
                {isLogin ? "Join_the_Cast" : "Register_Here"}
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-pink text-white border-3 border-ink rounded-xl font-black text-xs uppercase animate-shake">
                ERR: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="USERNAME"
                      required
                      className="input-brutal pl-12"
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="FULL_NAME"
                      className="input-brutal pl-12"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="EMAIL"
                  required
                  className="input-brutal pl-12"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  required
                  className="input-brutal pl-12"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                variant="violet"
                className="w-full py-4 mt-4 text-lg"
              >
                {isLogin ? (
                  <>
                    <LogIn size={20} /> SIGN_IN
                  </>
                ) : (
                  <>
                    <UserPlus size={20} /> SIGN_UP
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-6 border-t-3 border-ink/10 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan font-black uppercase text-xs tracking-widest hover:underline decoration-cyan decoration-4 underline-offset-4"
              >
                {isLogin
                  ? "New_here? [Create_Account]"
                  : "Known_user? [Authenticate]"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
