import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // Your DB-linked axios instance
import PulseCard from "./PulseCard";

const PulseFeed = ({ selectedCategory, searchQuery }) => {
  const [pulses, setPulses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * fetchPulses: Pulls data from the backend.
     * Uses the selectedCategory prop to filter the database query.
     */
    const fetchPulses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.q = searchQuery;

        const res = await api.get("/pulses", { params });
        setPulses(res.data);
      } catch (err) {
        // Detailed error logging for debugging API mismatches
        console.error("[PulseFeed] Data Sync Error:", err?.message);
        setPulses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPulses();
  }, [selectedCategory, searchQuery]); // Refetch when category filter or search changes

  // LOADING STATE: Consistent with the app's font style
  if (loading) {
    return (
      <div className="flex justify-center py-20 font-black italic text-violet animate-pulse text-xl">
        SYNCING_LIVE_PULSES...
      </div>
    );
  }

  // EMPTY STATE: Standardized Brutalist box
  if (!pulses.length) {
    return (
      <div className="bg-white border-3 border-ink border-dashed rounded-3xl p-12 text-center shadow-brutal">
        <p className="font-black text-ink/40 uppercase tracking-widest mb-4">
          No Active Signals
        </p>
        <p className="text-ink font-bold italic underline decoration-yellow decoration-4">
          Be the first to go live!
        </p>
      </div>
    );
  }

  // RENDER GRID: Uses gap-8 to maintain the Bento Grid spacing
  return (
    <div className="grid grid-cols-1 gap-8">
      {pulses.map((pulse) => (
        <PulseCard key={pulse.id} pulse={pulse} />
      ))}
    </div>
  );
};

export default PulseFeed;
