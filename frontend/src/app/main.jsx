/**
 * SKILLCAST FRONTEND - React Application Entry Point
 *
 * This is the main entry file that bootstraps the React application.
 *
 * Architecture:
 * 1. Imports global CSS styles (Tailwind + custom styles)
 * 2. Creates React root and renders the main App component
 * 3. Uses React.StrictMode for development warnings and checks
 *
 * To modify:
 * - Add global providers (theme, error boundaries) here
 * - Import additional global CSS or fonts
 * - Configure development tools or analytics
 *
 * Note: This file is referenced in index.html and loaded by Vite
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global styles - includes Tailwind base, components, and utilities
import "./index.css";

// Main application component with routing and state management
import App from "./App.jsx";

// Create React 18 root and render the application
// StrictMode enables additional development checks and warnings
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
