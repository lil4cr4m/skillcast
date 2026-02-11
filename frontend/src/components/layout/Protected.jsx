import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PROTECTED ROUTE WRAPPER
 * Checks AuthContext for a valid user. If missing, redirects to Login.
 */
const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking if a user is logged in via refresh token
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to login, but save the current location they were trying to reach
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Protected;
