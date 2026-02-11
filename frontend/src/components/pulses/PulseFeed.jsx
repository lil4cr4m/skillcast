import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // Your DB-linked axios instance
import PulseCard from "./PulseCard";

const PulseFeed = ({ selectedCategory, searchQuery }) => {
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * fetchPulses: Pulls data from the backend.
     * Uses the selectedCategory prop to filter the database query.
     */
    const fetchCasts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
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
  }, [selectedCategory, searchQuery]); // Refetch when category filter or search changes

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
        <PulseCard
          key={cast.id}
          pulse={cast}
          onUpdate={handleCastUpdate}
          onDelete={handleCastDelete}
        />
      ))}
    </div>
  );
};

export default PulseFeed;
