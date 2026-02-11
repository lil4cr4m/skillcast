import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import CreditForm from "../CreditForm";
import api from "../../api/axios";
import {
  ExternalLink,
  Heart,
  User as UserIcon,
  PencilLine,
  Trash2,
  Save,
  X,
} from "lucide-react";

const CastCard = ({ cast, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: cast.title,
    description: cast.description,
    meeting_link: cast.meeting_link,
  });

  // Owners (or admins) get edit/delete controls and skip credit form.
  const isOwner =
    user?.id === cast.creator_id || (user && user.role === "admin");

  const handleDelete = async () => {
    if (!window.confirm("End this cast?")) return;
    setDeleting(true);
    try {
      await api.delete(`/casts/${cast.id}`);
      onDelete?.(cast.id);
    } catch (err) {
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

      <Button
        variant="violet"
        className="w-full mb-3"
        onClick={() => window.open(cast.meeting_link)}
      >
        JOIN_CAST →
      </Button>

      <div className="flex gap-3">
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
        <a
          href={cast.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button
            variant="yellow"
            className="w-full flex items-center justify-center gap-2"
          >
            Join Lobby <ExternalLink size={16} />
          </Button>
        </a>
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
                variant="violet"
                className="flex-1"
                onClick={() => setEditMode(true)}
              >
                <PencilLine size={18} /> Edit
              </Button>
              <Button
                type="button"
                variant="pink"
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
