import React, { useEffect, useState } from "react";
import api from "../api/axios";
import CastCard from "./CastCard";

const CastFeed = ({ selectedChannel, searchQuery }) => {
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pull latest casts and allow channel/search filtering.
    const fetchCasts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedChannel) params.channel = selectedChannel;
        if (searchQuery) params.q = searchQuery;

        const res = await api.get("/casts", { params });
        setCasts(res.data);
      } catch (err) {
        setCasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
  }, [selectedChannel, searchQuery]);

  const handleCastUpdate = (updatedCast) => {
    setCasts((prev) =>
      prev.map((c) => (c.id === updatedCast.id ? updatedCast : c)),
    );
  };

  const handleCastDelete = (castId) => {
    setCasts((prev) => prev.filter((c) => c.id !== castId));
  };

  // LOADING STATE: Consistent with the app's font style
  if (loading) {
    return (
      <div className="flex justify-center py-20 font-black italic text-violet animate-pulse text-xl">
        SYNCING_LIVE_CASTS...
      </div>
    );
  }

  // EMPTY STATE: Standardized Brutalist box
  if (!casts.length) {
    return (
      <div className="bg-white border-3 border-ink border-dashed rounded-3xl p-12 text-center shadow-brutal">
        <p className="font-black text-ink/80 uppercase tracking-widest mb-4">
          No Live Casts
        </p>
        <p className="text-ink font-bold italic underline decoration-violet decoration-4">
          Be the first to cast!
        </p>
      </div>
    );
  }

  // RENDER GRID: Uses gap-8 to maintain the Bento Grid spacing
  return (
    <div className="grid grid-cols-1 gap-8">
      {casts.map((cast) => (
        <CastCard
          key={cast.id}
          cast={cast}
          onUpdate={handleCastUpdate}
          onDelete={handleCastDelete}
        />
      ))}
    </div>
  );
};

export default CastFeed;
