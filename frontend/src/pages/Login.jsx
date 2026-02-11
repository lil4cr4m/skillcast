import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Button } from "../components/ui/Button";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Zap,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  // 1. AUTH STATE: Destructure 'user' to check if already logged in, and 'logout' function
  const { user: activeUser, login, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 2. REDIRECT LOGIC
  const from = location.state?.from?.pathname || "/";

  // 3. SUBMIT LOGIC: Login/Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate(from, { replace: true });
      } else {
        await api.post("/auth/register", formData);
        setIsLogin(true);
        alert("ACCOUNT_INITIALIZED: Please log in.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "ACCESS_DENIED: Check credentials.",
      );
    }
  };

  // 4. LOGOUT LOGIC: Only triggered if user is already logged in
  const handleLogoutAction = async () => {
    try {
      await logout(); // Calls your AuthContext logout logic
      navigate("/login");
    } catch (err) {
      setError("LOGOUT_FAILED: System error.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border-3 border-ink p-8 md:p-10 rounded-[2.5rem] shadow-brutal-lg relative overflow-hidden">
        {/* VIEW A: USER IS LOGGED IN (Show Logout) */}
        {activeUser ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green border-3 border-ink rounded-full flex items-center justify-center mx-auto mb-6 shadow-brutal animate-pulse">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
              Session_Active
            </h2>
            <p className="text-ink/60 font-bold text-xs uppercase mb-8 tracking-widest">
              Identified as: {activeUser.username || activeUser.email}
            </p>

            <Button
              variant="pink"
              className="w-full py-4 text-lg"
              onClick={handleLogoutAction}
            >
              <LogOut size={20} /> TERMINATE_SESSION
            </Button>

            <button
              onClick={() => navigate("/")}
              className="mt-6 font-black uppercase text-[10px] tracking-[0.2em] underline decoration-violet decoration-2 underline-offset-4"
            >
              Return to Feed
            </button>
          </div>
        ) : (
          /* VIEW B: USER IS LOGGED OUT (Show Login/Signup) */
          <>
            <div className="absolute top-[1rem] right-[1rem] w-[4.5rem] h-[4.5rem] bg-yellow border-3 border-ink rounded-full flex items-center justify-center animate-bounce shadow-brutal-sm">
              <Zap size={28} />
            </div>

            <header className="text-center mb-10">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                {isLogin ? "IN THE CLUB" : "START SHARING"}
              </h2>
              <p className="text-ink/60 font-bold text-xs uppercase mt-2 tracking-widest">
                {isLogin ? "Join the Pulse" : "Register Here"}
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
                    <LogIn size={20} /> SIGN IN
                  </>
                ) : (
                  <>
                    <UserPlus size={20} /> SIGN UP
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
                  ? "New here? [Create_Account]"
                  : "Known user? [Authenticate]"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
