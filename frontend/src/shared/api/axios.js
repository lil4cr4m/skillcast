/**
 * SKILLCAST API CLIENT - Axios Configuration
 *
 * This is the centralized HTTP client for all API communication in SkillCast.
 * Handles authentication, token management, and API standardization.
 *
 * KEY FEATURES:
 * 1. AUTOMATIC AUTHENTICATION - Injects JWT tokens into all requests
 * 2. TOKEN REFRESH - Automatically refreshes expired access tokens
 * 3. ERROR HANDLING - Graceful handling of auth failures and network issues
 * 4. ENVIRONMENT CONFIGURATION - Adapts to local/staging/production APIs
 * 5. REQUEST/RESPONSE INTERCEPTORS - Consistent data transformation
 *
 * AUTHENTICATION FLOW:
 * 1. Request interceptor adds Bearer token from localStorage
 * 2. Response interceptor catches 401 (unauthorized) responses
 * 3. Attempts automatic token refresh using refresh token
 * 4. Retries original request with new access token
 * 5. If refresh fails, redirects user to login page
 *
 * USAGE:
 * ```jsx
 * import api from '../shared/api/axios';
 *
 * // GET request
 * const users = await api.get('/users');
 *
 * // POST request
 * const newCast = await api.post('/casts', { title, content });
 *
 * // All standard axios methods available
 * ```
 *
 * CONFIGURATION:
 * - Default API base URL: http://localhost:5001/api
 * - Override with VITE_API_URL environment variable
 * - All requests automatically include auth headers
 *
 * ERROR HANDLING:
 * - Network failures bubble up to calling components
 * - 401 errors trigger automatic login redirect
 * - Token refresh happens transparently
 *
 * SECURITY CONSIDERATIONS:
 * - Tokens stored in localStorage (consider httpOnly cookies for production)
 * - Automatic logout on token refresh failure
 * - No sensitive data logged in console
 */

import axios from "axios";

// 🌐 CREATE AXIOS INSTANCE
// Configure base URL and default settings for all SkillCast API calls
const api = axios.create({
  // 🔧 BASE URL CONFIGURATION
  // Uses environment variable if set, otherwise defaults to local backend
  // VITE_API_URL allows easy switching between dev/staging/production
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// 🔑 REQUEST INTERCEPTOR - Automatic Authentication
// Automatically attach JWT access token to every outgoing request
api.interceptors.request.use((config) => {
  // 📥 GET ACCESS TOKEN FROM STORAGE
  const token = localStorage.getItem("accessToken");

  // 🎫 ATTACH BEARER TOKEN IF AVAILABLE
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔄 RESPONSE INTERCEPTOR - Token Refresh & Error Handling
// Handles authentication errors and automatic token refresh
api.interceptors.response.use(
  // ✅ SUCCESS RESPONSES - Pass through unchanged
  (response) => response,

  // ❌ ERROR RESPONSES - Handle auth failures
  async (error) => {
    const originalRequest = error.config;

    // 🚫 TOKEN EXPIRED (401) - Attempt Refresh
    // Only try refresh once per request to prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 🔄 MARK REQUEST AS RETRIED
      originalRequest._retry = true;

      try {
        // 🎟️ GET REFRESH TOKEN
        const refreshToken = localStorage.getItem("refreshToken");

        // 📡 REQUEST NEW ACCESS TOKEN
        // Use base axios (not api instance) to avoid infinite recursion
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          token: refreshToken,
        });

        // 💾 STORE NEW ACCESS TOKEN
        localStorage.setItem("accessToken", res.data.accessToken);

        // 🔁 RETRY ORIGINAL REQUEST
        // Original request will now have new token via request interceptor
        return api(originalRequest);
      } catch (refreshError) {
        // 🧹 REFRESH FAILED - FORCE LOGOUT
        console.error("Token refresh failed, forcing logout:", refreshError);
        // Clear all local data and redirect to login
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    // 🚫 OTHER ERRORS - Bubble up to calling component
    return Promise.reject(error);
  },
);

export default api;
