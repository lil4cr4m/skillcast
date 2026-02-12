import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/api/axios";
import { useAuth } from "../../auth/context/AuthContext";
import Button from "../../../shared/ui/Button";
import { Save, ChevronLeft, User, FileText, Lock } from "lucide-react";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passStatus, setPassStatus] = useState({ message: "", error: "" });
  const [pwLoading, setPwLoading] = useState(false);

  // Load existing data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits your backend update route
      const res = await api.put(`/users/profile/${user.id}`, formData);

      // Update global context so the Navbar and Profile reflect changes immediately
      setUser({ ...user, ...res.data });

      navigate(`/profile/${user.id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile signal.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassStatus({ message: "", error: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassStatus({ message: "", error: "Passwords do not match" });
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPassStatus({
        message: "",
        error: "Password must be at least 8 characters",
      });
      return;
    }

    setPwLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPassStatus({ message: "Password updated successfully", error: "" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setPassStatus({
        message: "",
        error:
          err.response?.data?.error || "Unable to update password right now",
      });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-10 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-black uppercase text-xs mb-6 hover:text-violet transition-colors"
      >
        <ChevronLeft size={16} /> Back to Profile
      </button>

      <div className="bg-white border-3 border-ink p-8 rounded-[2.5rem] shadow-brutal-lg">
        <header className="mb-8">
          <h1 className="text-4xl font-black italic uppercase italic">
            Modify_Identity
          </h1>
          <p className="text-ink/50 font-bold text-xs uppercase tracking-widest">
            Update your public cast metadata
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME INPUT */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs italic">
              <User size={14} /> Display Name
            </label>
            <input
              type="text"
              className="input-brutal"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* BIO TEXTAREA */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs italic">
              <FileText size={14} /> Neural Bio
            </label>
            <textarea
              className="input-brutal h-32 resize-none"
              placeholder="Broadcast your skills..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            variant="cyan"
            className="w-full py-4 text-lg shadow-brutal hover:shadow-brutal-lg"
            disabled={loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? "SYNCING..." : "SAVE_CHANGES"}
          </Button>
        </form>
      </div>

      <div className="bg-white border-3 border-ink p-8 rounded-[2.5rem] shadow-brutal-lg">
        <header className="mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            Update_Password
          </h2>
          <p className="text-ink/50 font-bold text-xs uppercase tracking-widest">
            Secure your node with a new key
          </p>
        </header>

        {passStatus.error && (
          <div className="mb-4 p-4 bg-pink text-white border-3 border-ink rounded-xl font-black text-xs uppercase">
            {passStatus.error}
          </div>
        )}
        {passStatus.message && (
          <div className="mb-4 p-4 bg-green text-ink border-3 border-ink rounded-xl font-black text-xs uppercase">
            {passStatus.message}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs italic">
              <Lock size={14} /> Current Password
            </label>
            <input
              type="password"
              className="input-brutal"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs italic">
                <Lock size={14} /> New Password
              </label>
              <input
                type="password"
                className="input-brutal"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs italic">
                <Lock size={14} /> Confirm Password
              </label>
              <input
                type="password"
                className="input-brutal"
                placeholder="Re-enter new password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="cyan"
            className="w-full py-4 text-lg shadow-brutal hover:shadow-brutal-lg"
            disabled={pwLoading}
          >
            <Save size={20} className="mr-2" />
            {pwLoading ? "UPDATING..." : "CHANGE_PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
