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
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { Button } from "../../../shared/ui/Button";
import NotesForm from "./NotesForm";
import api from "../../../shared/api/axios";
import {
  ExternalLink,
  Heart,
  User as UserIcon,
  PencilLine,
  Trash2,
  Save,
  X,
  Play,
  Pause,
  StopCircle,
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

  const formatSnakeIfMultiWord = (value) => {
    const raw = value?.toString().trim();
    if (!raw) return raw;
    if (!/\s/.test(raw)) return raw.toUpperCase();
    return raw
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "")
      .toUpperCase();
  };

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
   * Status Update Handlers - Manage Cast Status
   *
   * SECURITY: Only owners/admins can change status
   * STATES: LIVE (active), PAUSED (temporarily stopped), ENDED (finished)
   */

  const handleStatusChange = async (newStatus) => {
    if (
      newStatus === "ENDED" &&
      !window.confirm("END_THIS_CAST_PERMANENTLY?")
    )
      return;
    setSaving(true);
    try {
      const res = await api.put(`/casts/${cast.id}`, { status: newStatus });
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Error updating cast status:", err);
      alert("UNABLE_TO_UPDATE_CAST_STATUS");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("DELETE_THIS_CAST_PERMANENTLY?")) return;
    setDeleting(true);
    try {
      await api.delete(`/casts/${cast.id}`);
      onDelete?.(cast.id);
    } catch (err) {
      console.error("Error deleting cast:", err);
      alert("UNABLE_TO_DELETE_CAST_RIGHT_NOW");
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
      alert("UPDATE_FAILED_PLEASE_CHECK_FIELDS_AND_TRY_AGAIN");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-4 border-ink p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-ink text-offwhite px-2 py-1 text-[0.6rem] font-black uppercase tracking-widest">
          {formatSnakeIfMultiWord(cast.skill?.channel) || "GENERAL"} // CHANNEL
        </span>
        {/* LIVE status: green animated dot (neon color) */}
        {cast.status === "LIVE" && (
          <div className="h-3 w-3 bg-neon rounded-full animate-pulse border-2 border-ink" />
        )}
        {/* ENDED status: red static dot (danger color) */}
        {cast.status === "ENDED" && (
          <div className="h-3 w-3 bg-danger rounded-full border-2 border-ink" />
        )}
      </div>

      <h3 className="text-2xl font-black uppercase leading-none mb-2">
        {formatSnakeIfMultiWord(cast.title)}
      </h3>
      <p className="text-sm font-bold text-ink/70 mb-6 line-clamp-3">
        {cast.description}
      </p>

      <div className="flex items-center justify-between mb-4 text-[0.85rem] font-black uppercase tracking-tighter">
        <Link
          to={`/profile/${cast.creator_id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-pink border-2 border-ink rounded-full flex items-center justify-center shadow-brutal">
            <UserIcon size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-pink italic">
              @{cast.username || "ANONYMOUS"}
            </div>
            <div className="text-ink/60 text-[0.65rem] tracking-widest">
              {formatSnakeIfMultiWord(cast.skill?.name || cast.skill_name) ||
                "SKILLCASTER"}
            </div>
          </div>
        </Link>
        <div className="text-right leading-tight">
          <p className="text-[0.6rem] text-ink/60">TOTAL_CREDIT</p>
          <p className="text-xl">{cast.credit ?? 0}</p>
        </div>
      </div>

      {/* VIEWER BUTTONS - One line layout */}
      {!isOwner && (
        <div className="flex gap-1.5">
          {/* Show JOIN_CAST for LIVE casts, INACTIVE_CAST for ENDED casts */}
          {cast.status === "LIVE" ? (
            <a
              href={cast.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-0"
            >
              <Button
                variant="violet"
                className="w-full flex items-center justify-center gap-1.5 text-[0.65rem] px-3 py-2"
              >
                JOIN_CAST <ExternalLink size={12} />
              </Button>
            </a>
          ) : cast.status === "ENDED" ? (
            <Button
              variant="outline"
              className="flex-1 min-w-0 text-[0.65rem] px-3 py-2 cursor-not-allowed opacity-60"
              disabled
            >
              INACTIVE_CAST
            </Button>
          ) : null}
          {/* Heart button for sending notes - available for both LIVE and ENDED */}
          {user && (cast.status === "LIVE" || cast.status === "ENDED") && (
            <Button
              variant="outline"
              className="px-2.5 py-2"
              onClick={() => setShowCreditForm(!showCreditForm)}
            >
              <Heart
                size={16}
                className={showCreditForm ? "fill-pink text-pink" : "text-ink"}
              />
            </Button>
          )}
        </div>
      )}

      {/* OWNER BUTTONS - 3 buttons: EDIT, END_CAST/RESUME_CAST, DELETE_CAST */}
      {isOwner && !editMode && (
        <div className="flex gap-1.5">
          {/* Button 1: EDIT */}
          <Button
            variant="cyan"
            className="flex-1 min-w-0 text-[0.65rem] px-2 py-2 gap-1"
            onClick={() => setEditMode(true)}
          >
            <PencilLine size={12} /> EDIT_CAST
          </Button>

          {/* Button 2: END_CAST (when LIVE) or RESUME_CAST (when PAUSED/ENDED) */}
          {cast.status === "LIVE" ? (
            <Button
              variant="danger"
              className="flex-1 min-w-0 text-[0.65rem] px-2 py-2 gap-1"
              onClick={() => handleStatusChange("ENDED")}
              disabled={saving}
            >
              <StopCircle size={12} /> END_CAST
            </Button>
          ) : (
            (cast.status === "PAUSED" || cast.status === "ENDED") && (
              <Button
                variant="neon"
                className="flex-1 min-w-0 text-[0.65rem] px-2 py-2 gap-1"
                onClick={() => handleStatusChange("LIVE")}
                disabled={saving}
              >
                <Play size={12} /> RESUME_CAST
              </Button>
            )
          )}

          {/* Button 3: DELETE_CAST (archives cast) */}
          {cast.status !== "ARCHIVED" && (
            <Button
              variant="danger"
              className="flex-1 min-w-0 text-[0.65rem] px-2 py-2 gap-1"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={12} /> {deleting ? "DELETING..." : "DELETE_CAST"}
            </Button>
          )}
        </div>
      )}

      {showCreditForm && (
        <div className="mt-3 p-3 border-2 border-ink rounded-xl bg-pink-muted/10 animate-in slide-in-from-top-2 duration-300">
          <NotesForm
            castId={cast.id}
            onNoteSent={() => setTimeout(() => setShowCreditForm(false), 1500)}
          />
        </div>
      )}

      {/* EDIT FORM - Shows when owner clicks edit */}
      {isOwner && editMode && (
        <div className="mt-4">
          <form onSubmit={handleUpdate} className="space-y-2">
            <input
              type="text"
              className="input-brutal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="cast_title"
              required
            />
            <textarea
              className="input-brutal h-24 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="description"
            />
            <input
              type="url"
              className="input-brutal"
              value={formData.meeting_link}
              onChange={(e) =>
                setFormData({ ...formData, meeting_link: e.target.value })
              }
              placeholder="meeting_link"
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="violet"
                className="flex-1 text-xs"
                disabled={saving}
              >
                <Save size={14} /> {saving ? "SAVING..." : "SAVE"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setEditMode(false)}
              >
                <X size={14} /> CANCEL
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CastCard;
