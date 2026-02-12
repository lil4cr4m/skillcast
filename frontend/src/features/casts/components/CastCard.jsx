/**
 * SKILLCAST CAST CARD - Individual Cast Display & Interaction Component
 *
 * This is a comprehensive card component that displays individual skill-sharing posts ("casts")
 * with full interaction capabilities including viewing, editing, crediting, and joining.
 *
 * KEY FEATURES:
 * 1. CAST INFORMATION DISPLAY - Title, description, creator, skill, credit total
 * 2. LIVE STATUS INDICATOR - Visual indicator for active casts
 * 3. JOIN FUNCTIONALITY - Direct link to meeting/video call
 * 4. CREDIT SYSTEM - Allow users to give credit/appreciation to casters
 * 5. OWNER CONTROLS - Edit and delete functionality for cast creators
 * 6. ADMIN CONTROLS - Admin users can manage any cast
 * 7. RESPONSIVE DESIGN - Adapts to different screen sizes
 * 8. ACCESSIBILITY - Semantic HTML and clear visual hierarchy
 *
 * USER INTERACTIONS BY ROLE:
 * - GUEST/VISITOR: View cast info, join cast (if link available)
 * - LOGGED-IN USER: Everything above + give credit via heart button
 * - CAST OWNER: Everything above + edit/delete controls (no credit form)
 * - ADMIN: Full access to all cast management functions
 *
 * EDITING FEATURES:
 * - Inline edit mode with form validation
 * - Real-time form updates with controlled inputs
 * - Cancel functionality to revert changes
 * - Loading states for user feedback during saves
 *
 * Props:
 * @param {Object} cast - Cast data object from API
 * @param {Function} onUpdate - Callback when cast is updated
 * @param {Function} onDelete - Callback when cast is deleted
 */

import React, { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { Button } from "../../../shared/ui/Button";
import CreditForm from "./CreditForm";
import api from "../../../shared/api/axios";
import {
  ExternalLink,
  Heart,
  User as UserIcon,
  PencilLine,
  Trash2,
  Save,
  X,
} from "lucide-react";

/**
 * CastCard Component - Interactive Cast Display
 *
 * STATE MANAGEMENT:
 * - showCreditForm: Toggle visibility of credit giving interface
 * - editMode: Toggle between view and edit modes for cast owners
 * - saving/deleting: Loading states for async operations
 * - formData: Controlled form inputs for cast editing
 *
 * PERMISSION SYSTEM:
 * - isOwner: Cast creator or admin can edit/delete
 * - Regular users: Can view and credit casts
 * - Unauthenticated: Can view casts only
 */
const CastCard = ({ cast, onUpdate, onDelete }) => {
  // 🔐 AUTHENTICATION & PERMISSIONS
  const { user } = useAuth();

  // 🎛️ UI STATE MANAGEMENT
  const [showCreditForm, setShowCreditForm] = useState(false); // Credit interface visibility
  const [editMode, setEditMode] = useState(false); // Edit form visibility
  const [saving, setSaving] = useState(false); // Save operation loading
  const [deleting, setDeleting] = useState(false); // Delete operation loading

  // 📝 EDIT FORM STATE
  // Controlled inputs for inline cast editing
  const [formData, setFormData] = useState({
    title: cast.title,
    description: cast.description,
    meeting_link: cast.meeting_link,
  });

  // 🔐 PERMISSION CHECK
  // Cast owners and admins get full management capabilities
  const isOwner =
    user?.id === cast.creator_id || (user && user.role === "admin");

  /**
   * Delete Handler - Remove Cast
   *
   * SECURITY: Only owners/admins can delete
   * UX: Confirmation dialog prevents accidental deletion
   * OPTIMISTIC: Immediately updates parent component via callback
   */

  const handleDelete = async () => {
    if (!window.confirm("End this cast?")) return;
    setDeleting(true);
    try {
      await api.delete(`/casts/${cast.id}`);
      onDelete?.(cast.id);
    } catch (err) {
      console.error("Error deleting cast:", err);
      alert("Unable to delete cast right now.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/casts/${cast.id}`, formData);
      onUpdate?.(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating cast:", err);
      alert("Update failed. Please check fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-black text-white px-2 py-1 text-[0.6rem] font-black uppercase tracking-widest">
          {cast.skill?.channel || "GENERAL"} // CHANNEL
        </span>
        {cast.is_live && (
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse border-2 border-black" />
        )}
      </div>

      <h3 className="text-2xl font-black uppercase leading-none mb-2">
        {cast.title}
      </h3>
      <p className="text-sm font-bold text-black/70 mb-6 line-clamp-3">
        {cast.description}
      </p>

      <div className="flex items-center justify-between mb-4 text-[0.85rem] font-black uppercase tracking-tighter">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
            <UserIcon size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-pink italic">
              @{cast.username || "anonymous"}
            </div>
            <div className="text-black/60 text-[0.65rem] tracking-widest">
              {cast.skill?.name || cast.skill_name || "Skillcaster"}
            </div>
          </div>
        </div>
        <div className="text-right leading-tight">
          <p className="text-[0.6rem] text-black/60">TOTAL_CREDIT</p>
          <p className="text-xl">{cast.credit ?? 0}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={cast.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button
            variant="violet"
            className="w-full flex items-center justify-center gap-2"
          >
            JOIN_CAST <ExternalLink size={16} />
          </Button>
        </a>
        {user && !isOwner && (
          <Button
            variant="outline"
            className="px-3"
            onClick={() => setShowCreditForm(!showCreditForm)}
          >
            <Heart
              size={18}
              className={showCreditForm ? "fill-pink text-pink" : "text-black"}
            />
          </Button>
        )}
      </div>

      {showCreditForm && (
        <div className="mt-3 p-3 border-2 border-black rounded-xl bg-pink/10 animate-in slide-in-from-top-2 duration-300">
          <CreditForm
            castId={cast.id}
            onNoteSent={() => setTimeout(() => setShowCreditForm(false), 1500)}
          />
        </div>
      )}

      {isOwner && (
        <div className="mt-4 space-y-3">
          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              <input
                type="text"
                className="input-brutal"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Cast title"
                required
              />
              <textarea
                className="input-brutal h-24 resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
              />
              <input
                type="url"
                className="input-brutal"
                value={formData.meeting_link}
                onChange={(e) =>
                  setFormData({ ...formData, meeting_link: e.target.value })
                }
                placeholder="Meeting link"
                required
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="violet"
                  className="flex-1"
                  disabled={saving}
                >
                  <Save size={18} /> {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditMode(false)}
                >
                  <X size={18} /> Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="cyan"
                className="flex-1"
                onClick={() => setEditMode(true)}
              >
                <PencilLine size={18} /> Edit
              </Button>
              <Button
                type="button"
                variant="cyan"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 size={18} /> {deleting ? "Ending..." : "End Cast"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CastCard;
