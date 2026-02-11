import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import GratitudeForm from "../GratitudeForm";
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

const PulseCard = ({ pulse, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showGratitude, setShowGratitude] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: pulse.title,
    description: pulse.description,
    meeting_link: pulse.meeting_link,
  });

  // Logic: Users shouldn't thank themselves. Linked to DB creator_id.
  const isOwner =
    user?.id === pulse.creator_id || (user && user.role === "admin");

  const handleDelete = async () => {
    if (!window.confirm("End this cast?")) return;
    setDeleting(true);
    try {
      await api.delete(`/casts/${pulse.id}`);
      onDelete?.(pulse.id);
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
      const res = await api.put(`/casts/${pulse.id}`, formData);
      onUpdate?.(res.data);
      setEditMode(false);
    } catch (err) {
      alert("Update failed. Please check fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-[0.1875rem] border-ink p-[1.75rem] md:p-[2.25rem] rounded-[1.5rem] shadow-brutal-lg hover-lift group h-full flex flex-col">
      {/* HEADER: Channel and Credit */}
      <div className="flex justify-between items-start gap-[1.25rem] mb-[1.25rem]">
        <span className="bg-cyan border-[0.1875rem] border-ink px-[0.5rem] py-[0.25rem] rounded text-[0.625rem] font-black uppercase tracking-widest leading-none">
          {pulse.channel || "General"}
        </span>
        <div className="text-[0.875rem] md:text-[1rem] font-black italic underline decoration-yellow decoration-[0.125rem] md:decoration-[0.25rem] underline-offset-2 tracking-tighter leading-tight shrink-0">
          {pulse.credit ?? 0} CR
        </div>
      </div>

      {/* BODY: Title and Description */}
      <h3 className="text-[1.5rem] font-black leading-tight tracking-tighter uppercase mb-[1rem] group-hover:text-violet transition-colors truncate">
        {pulse.title}
      </h3>
      <p className="text-[1rem] text-ink/70 font-bold leading-[1.6] mb-[1.75rem] line-clamp-2 flex-1">
        {pulse.description}
      </p>

      {/* USER INFO: Linked to DB User Object */}
      <div className="flex items-center justify-between text-[0.875rem] font-bold mb-[1.75rem]">
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-10 h-10 bg-pink border-[0.1875rem] border-ink rounded-full flex items-center justify-center shadow-brutal-sm">
            <UserIcon size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-pink font-black italic leading-tight">
              @{pulse.username || "anonymous"}
            </div>
            <div className="text-ink/50 text-[0.625rem] uppercase tracking-tighter leading-none">
              {pulse.skill_name || "Skillcaster"}
            </div>
          </div>
        </div>
        {/* Neon Green "Live" Tag */}
        <span className="bg-violet border-[0.1875rem] border-ink px-[0.5rem] py-[0.25rem] rounded text-[0.625rem] font-black uppercase tracking-widest leading-none text-white">
          Live
        </span>
      </div>

      {/* ACTIONS: Join and Gratitude */}
      <div className="flex gap-[0.75rem] mt-auto">
        <a
          href={pulse.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button
            variant="yellow"
            className="w-full flex items-center justify-center gap-[0.5rem] py-[0.5rem] leading-tight"
          >
            Join <ExternalLink size={16} />
          </Button>
        </a>

        {/* DB PROTECTION: Only show 'Thank' if logged in and not the owner */}
        {user && !isOwner && (
          <Button
            variant="outline"
            className="px-[0.75rem]"
            onClick={() => setShowGratitude(!showGratitude)}
          >
            <Heart
              size={20}
              className={showGratitude ? "fill-pink text-pink" : "text-ink"}
            />
          </Button>
        )}
      </div>

      {/* CONDITIONAL FORM: Gratitude Flow */}
      {showGratitude && (
        <div className="mt-[1rem] p-[1rem] border-[0.1875rem] border-ink rounded-xl bg-pink/10 animate-in slide-in-from-top-2 duration-300">
          <GratitudeForm
            castId={pulse.id}
            onNoteSent={() => setTimeout(() => setShowGratitude(false), 2000)}
          />
        </div>
      )}

      {/* OWNER CONTROLS */}
      {isOwner && (
        <div className="mt-[1.25rem] space-y-[0.75rem]">
          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-3">
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
                className="input-brutal h-28 resize-none"
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
              <div className="flex gap-[0.75rem]">
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
            <div className="flex gap-[0.75rem]">
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

export default PulseCard;
