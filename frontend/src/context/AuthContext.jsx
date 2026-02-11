import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

/**
 * Provides auth state (user, loading) and helpers (login, logout).
 * Persists tokens and user in localStorage for reloads.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage and attempt a single refresh.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const refreshToken = localStorage.getItem("refreshToken");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const tryRefresh = async () => {
      if (!refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.post("/auth/refresh", { token: refreshToken });
        localStorage.setItem("accessToken", res.data.accessToken);
      } catch (err) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user: userPayload } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userPayload));
      setUser(userPayload);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { token: refreshToken });
      }
    } catch {
      // Ignore logout API failures; local tokens will still be cleared
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default AuthContext;
