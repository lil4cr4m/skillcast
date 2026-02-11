import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context & Security
import { AuthProvider } from "./context/AuthContext";
import Protected from "./components/layout/Protected";

// Layout Components
import Navbar from "./components/layout/Navbar";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreatePulse from "./pages/CreatePulse";

/**
 * MAIN APP COMPONENT
 * 2026 Architecture: Centralized routing with global Auth State
 */
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* 1. Provider starts here */}
      <Router>
        <div className="min-h-screen bg-offwhite">
          <Navbar /> {/* 2. Navbar is now INSIDE and can see the Auth state */}
          <main className="max-w-layout mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings/profile" element={<EditProfile />} />

              {/* PROTECTED ROUTES: Only accessible if logged in */}
              <Route
                path="/create"
                element={
                  <Protected>
                    <CreatePulse />
                  </Protected>
                }
              />

              {/* 404 FALLBACK */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center py-20">
                    <h1 className="text-6xl font-black text-violet">404</h1>
                    <p className="text-ink/60 mt-4 font-bold uppercase text-xs tracking-widest">
                      FEED_NOT_FOUND: ROUTE BACK TO LIVE_CASTS.
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
