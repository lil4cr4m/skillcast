import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CastFeed from "../components/CastFeed";
import Leaderboard from "../components/Leaderboard";
import { Button } from "../components/ui/Button";

const Home = () => {
  // Access dynamic user data from the DB via AuthContext
  const { user } = useAuth();
  const [activeChannel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    /* Main Layout Container: Standardized Grid spacing */
    <div className="max-w-layout mx-auto p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* IDENTITY COL */}
      <aside
        className="lg:col-span-3 lg:sticky lg:top-[6rem] space-y-6 order-2 lg:order-1"
        aria-label="User actions and stats"
      >
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            USER//{" "}
            <span className="text-violet italic">
              {user?.username || "Guest"}
            </span>
          </h1>
          <div className="bg-yellow border-4 border-black p-4 mb-4">
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-black/60">
              Total_Credit
            </p>
            <p className="text-4xl font-black leading-none">
              {user?.credit || 0}
            </p>
          </div>
          <Link to="/create">
            <Button
              variant="neon"
              className="w-full py-4 text-lg text-center justify-center"
            >
              START_CASTING
            </Button>
          </Link>
        </div>
      </aside>

      {/* FEED COL */}
      <section className="lg:col-span-6 space-y-[2.5rem] order-1 lg:order-2">
        <section className="space-y-[1.5rem]">
          <div className="flex items-center justify-between mb-[0.5rem]">
            <h2 className="text-h2-m xl:text-h2-d font-black italic uppercase tracking-tighter leading-tight">
              LIVE_CASTS
            </h2>
            <div className="flex gap-[0.5rem] items-center">
              <span className="w-3 h-3 rounded-full bg-green animate-pulse border-2 border-ink" />
              <span className="text-[0.6rem] xl:text-[0.625rem] font-black uppercase tracking-widest leading-none">
                Casting Now
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-[1rem] items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="SEARCH_FOR_CHANNELS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-brutal w-full pr-12"
              />
              <Search className="absolute right-4 top-4 opacity-40" />
            </div>
          </div>

          <CastFeed
            selectedChannel={activeChannel}
            searchQuery={searchQuery.trim()}
          />
        </section>
      </section>

      {/* LEADERBOARD COL */}
      <aside
        className="lg:col-span-3 lg:sticky lg:top-[6rem] order-3"
        aria-label="Top casters leaderboard"
      >
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-[1.5rem] border-b-4 border-black bg-yellow">
            <h2 className="text-[1.25rem] font-black uppercase tracking-tighter leading-none">
              Top_Casters
            </h2>
          </div>
          <div className="min-w-0">
            <Leaderboard />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;
