import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../shared/api/axios";
import { useAuth } from "../../auth/context/AuthContext";
import { Button } from "../../../shared/ui/Button";
import {
  User,
  Award,
  Activity,
  Heart,
  Edit3,
  PencilLine,
  Trash2,
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [sentNotes, setSentNotes] = useState([]);
  const [receivedNotes, setReceivedNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Check if this is the logged-in user's own profile
  const isOwnProfile = currentUser?.id?.toString() === id?.toString();
  const canManageReceived = isOwnProfile || currentUser?.role === "admin";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchSent = async () => {
      if (!isOwnProfile) return;
      try {
        const res = await api.get("/notes/sent");
        setSentNotes(res.data);
      } catch (err) {
        console.error("Error fetching sent notes:", err);
        setSentNotes([]);
      }
    };
    fetchSent();
  }, [isOwnProfile]);

  useEffect(() => {
    const fetchReceived = async () => {
      if (!canManageReceived) return;
      try {
        const res = await api.get(`/notes/user/${id}`);
        setReceivedNotes(res.data);
      } catch (err) {
        console.error("Error fetching received notes:", err);
        setReceivedNotes([]);
      }
    };
    fetchReceived();
  }, [id, canManageReceived]);

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="font-black italic text-2xl animate-pulse text-violet uppercase tracking-tighter">
          Decrypting_User_Data...
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-12 space-y-10">
      <div className="bg-white border-3 border-ink p-[2.25rem] md:p-[3rem] rounded-[2.5rem] shadow-brutal-lg flex flex-col md:flex-row md:flex-nowrap items-center gap-[2.5rem] md:gap-[3rem] relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-muted/10 -mr-16 -mt-16 rounded-full border-3 border-ink" />

        <div className="flex flex-col items-center gap-3">
          <div className="h-32 w-32 md:h-40 md:w-40 bg-pink border-3 border-ink rounded-full flex items-center justify-center shadow-brutal shrink-0 overflow-hidden">
            <User size={64} className="text-white" />
          </div>
        </div>

        <div className="text-center md:text-left flex-1 min-w-0 w-full space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 flex-wrap">
            <div className="flex flex-col md:flex-row items-center gap-3 flex-wrap min-w-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase leading-tight break-words text-balance max-w-full">
                {profile.name || profile.username}
              </h1>
            </div>
          </div>

          <p className="text-pink font-black text-xl tracking-tight">
            <Link to={`/profile/${profile.id}`} className="hover:underline">
              @{profile.username}
            </Link>
          </p>

          <div className="pt-4 max-w-2xl mx-auto md:mx-0 space-y-2">
            <h2 className="text-[10px] font-black uppercase text-ink/80 tracking-[0.2em] mb-1">
              Neural_Bio
            </h2>
            <p className="font-bold text-lg leading-tight text-pretty break-words">
              {profile.bio || "This node has not broadcasted a bio signal yet."}
            </p>
          </div>
        </div>
      </div>
      {/* EDIT BUTTON OUTSIDE CARD */}
      {isOwnProfile && (
        <div className="flex">
          <Button
            variant="neon"
            onClick={() => navigate("/settings/profile")}
            className="flex items-center gap-2 py-3 px-6 shadow-brutal w-full justify-center"
          >
            <Edit3 size={18} /> EDIT_SIGNAL
          </Button>
        </div>
      )}
      {/* STATS GRID: Data pulled from users table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-yellow border-3 border-ink p-6 rounded-3xl shadow-brutal flex flex-col items-center text-center gap-3">
          <Award size={32} />
          <div className="text-5xl font-black tabular-nums leading-tight text-center">
            {profile.credit}
          </div>
          <div className="font-black text-[10px] uppercase tracking-widest italic opacity-60 text-center">
            Credits
          </div>
        </div>

        <div className="bg-violet border-3 border-ink p-6 rounded-3xl shadow-brutal flex flex-col items-center text-center text-white gap-3">
          <Activity size={32} />
          <div className="text-5xl font-black tabular-nums leading-tight text-center">
            {profile.total_casts}
          </div>
          <div className="font-black text-[10px] uppercase tracking-widest italic opacity-70 text-center">
            Casts_Hosted
          </div>
        </div>

        <div className="bg-pink border-3 border-ink p-6 rounded-3xl shadow-brutal flex flex-col items-center text-center text-white gap-3">
          <Heart size={32} className="text-white" />
          <div className="text-5xl font-black tabular-nums leading-tight text-center">
            {profile.notes_received}
          </div>
          <div className="font-black text-[10px] uppercase tracking-widest italic opacity-80 text-center">
            Gratitude_Notes
          </div>
        </div>

        <div className="bg-white border-3 border-ink p-6 rounded-3xl shadow-brutal flex flex-col items-center text-center gap-3 justify-center text-ink">
          <div className="font-black uppercase text-xs tracking-widest text-center">
            {profile.role || "Member"}
          </div>
          <div className="text-sm font-bold uppercase text-ink text-center leading-tight">
            Since {joinDate}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* SECTION: NOTES SENT (Only visible to the profile owner) */}
        {isOwnProfile && (
          <div className="bg-white border-3 border-ink p-6 rounded-[2rem] shadow-brutal-lg space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                NOTES_SENT
              </h3>
              <span className="bg-violet text-white text-[0.65rem] px-2 py-1 font-black rounded-full border-2 border-ink">
                OUTGOING_SIGNAL
              </span>
            </div>

            {sentNotes.length === 0 ? (
              <p className="text-ink/60 font-bold italic p-4">
                No notes sent to the network yet.
              </p>
            ) : (
              <div className="space-y-4">
                {sentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="border-3 border-ink rounded-2xl p-5 bg-white shadow-brutal hover:shadow-none transition-all flex flex-col gap-3"
                  >
                    {/* Header: Context & Metadata */}
                    <div className="flex justify-between items-start border-b-2 border-ink/10 pb-2">
                      <div className="min-w-0">
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-violet block mb-1">
                          TARGET_CAST
                        </span>
                        <p className="font-black text-ink uppercase truncate">
                          {note.cast_title}
                        </p>
                      </div>
                      <p className="text-[0.65rem] font-bold text-ink/40 uppercase">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Content Logic: Edit Mode vs Display Mode */}
                    {editingNoteId === note.id ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const res = await api.put(`/notes/${note.id}`, {
                              content: editingContent,
                            });
                            setSentNotes((prev) =>
                              prev.map((n) =>
                                n.id === note.id
                                  ? { ...n, content: res.data.content }
                                  : n,
                              ),
                            );
                            setEditingNoteId(null);
                          } catch (err) {
                            alert("UPDATE_FAILURE");
                          }
                        }}
                        className="space-y-3"
                      >
                        <textarea
                          className="input-brutal h-24 text-sm resize-none"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          required
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="violet"
                            type="submit"
                            className="flex-1 py-2 text-xs"
                          >
                            SAVE_REVISION
                          </Button>
                          <Button
                            variant="outline"
                            type="button"
                            className="flex-1 py-2 text-xs"
                            onClick={() => setEditingNoteId(null)}
                          >
                            CANCEL
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="py-1">
                        <p className="text-sm text-ink font-bold leading-tight italic break-words">
                          "{note.content}"
                        </p>
                      </div>
                    )}

                    {/* Footer: Attribution & Actions */}
                    {!editingNoteId && (
                      <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-ink/10">
                        <p className="text-[0.7rem] font-bold text-ink uppercase">
                          TO_HOST:{" "}
                          <span className="text-violet">
                            @{note.receiver_username || "Caster"}
                          </span>
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            className="px-3 py-2"
                            onClick={() => {
                              setEditingNoteId(note.id);
                              setEditingContent(note.content);
                            }}
                          >
                            <PencilLine size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            className="px-3 py-2"
                            onClick={async () => {
                              if (!window.confirm("Delete sent note?")) return;
                              try {
                                await api.delete(`/notes/${note.id}`);
                                setSentNotes((prev) =>
                                  prev.filter((n) => n.id !== note.id),
                                );
                              } catch (err) {
                                alert("DELETE_FAILURE");
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: NOTES RECEIVED (Visible to owner or admin) */}
        {canManageReceived && (
          <div className="bg-white border-3 border-ink p-6 rounded-[2rem] shadow-brutal-lg space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                NOTES_RECEIVED
              </h3>
              <span className="bg-pink text-white text-[0.65rem] px-2 py-1 font-black rounded-full border-2 border-ink">
                INCOMING_SIGNAL
              </span>
            </div>

            {receivedNotes.length === 0 ? (
              <p className="text-ink/60 font-bold italic p-4">
                No gratitude signals received yet.
              </p>
            ) : (
              <div className="space-y-4">
                {receivedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="border-3 border-ink rounded-2xl p-5 bg-white shadow-brutal flex flex-col gap-3"
                  >
                    {/* Header: Context & Metadata */}
                    <div className="flex justify-between items-start border-b-2 border-ink/20 pb-2">
                      <div className="min-w-0">
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-pink block mb-1">
                          SOURCE_CAST
                        </span>
                        <p className="font-black text-ink uppercase truncate">
                          {note.cast_title}
                        </p>
                      </div>
                      <p className="text-[0.65rem] font-bold text-ink/40 uppercase">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="py-1">
                      <p className="text-sm text-ink font-bold leading-tight break-words italic">
                        "{note.content}"
                      </p>
                    </div>

                    {/* Footer: Attribution & Actions */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-ink/20">
                      <p className="text-[0.7rem] font-bold text-ink uppercase">
                        FROM:{" "}
                        <Link
                          to={`/profile/${note.sender_id}`}
                          className="text-pink hover:underline font-black tracking-tighter"
                        >
                          @{note.sender_username || "Anonymous"}
                        </Link>
                      </p>
                      <Button
                        variant="danger"
                        className="px-3 py-2"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "Scrub this signal from your profile?",
                            )
                          )
                            return;
                          try {
                            await api.delete(`/notes/${note.id}`);
                            setReceivedNotes((prev) =>
                              prev.filter((n) => n.id !== note.id),
                            );
                          } catch (err) {
                            alert("SCRUB_FAILURE");
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
