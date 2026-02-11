import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import GratitudeForm from "../GratitudeForm";
import { ExternalLink, Heart, User as UserIcon } from "lucide-react";

const PulseCard = ({ pulse }) => {
  const { user } = useAuth();
  const [showGratitude, setShowGratitude] = useState(false);

  // Logic: Users shouldn't thank themselves
  const isOwner = user?.id === pulse.creator_id;

  return (
    <div className="bg-white border-3 border-black p-6 shadow-brutal-lg transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-vibe text-white border-2 border-black px-3 py-1 text-xs font-black uppercase">
          {pulse.vibe_category || "Vibe"}
        </span>
        <div className="font-black text-xl italic underline decoration-fresh decoration-4">
          {pulse.karma ?? 0} KP
        </div>
      </div>

      <h3 className="text-2xl font-black mb-2 leading-tight">{pulse.title}</h3>
      <p className="font-medium text-slate-700 mb-6 line-clamp-3">
        {pulse.description}
      </p>

      <div className="flex items-center justify-between text-sm font-bold mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-slate-100 border-2 border-black rounded-full flex items-center justify-center text-slate-700">
            <UserIcon size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-slate-900">{pulse.username}</div>
            <div className="text-slate-500 text-xs">Live now</div>
          </div>
        </div>
        <span className="bg-accent border-2 border-black px-2 py-1 text-xs uppercase">
          {pulse.interest_name || ""}
        </span>
      </div>

      <div className="flex gap-3">
        <a
          href={pulse.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            Join Pulse <ExternalLink size={16} />
          </Button>
        </a>

        {user && !isOwner && (
          <Button
            variant="outline"
            className="px-3"
            onClick={() => setShowGratitude(!showGratitude)}
          >
            <Heart
              size={18}
              className={showGratitude ? "fill-rose-500 text-rose-500" : ""}
            />
          </Button>
        )}
      </div>

      {showGratitude && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <GratitudeForm
            pulseId={pulse.id}
            onNoteSent={() => setTimeout(() => setShowGratitude(false), 2000)}
          />
        </div>
      )}
    </div>
  );
};

export default PulseCard;
