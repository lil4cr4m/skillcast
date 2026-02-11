import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Trophy, PlusCircle, Search, Activity } from "lucide-react";

// Project Imports - Standardized Paths
import { useAuth } from "../context/AuthContext";
import PulseFeed from "../components/pulses/PulseFeed";
import Leaderboard from "../components/Leaderboard";
import { Button } from "../components/ui/Button";

const Home = () => {
  // Access dynamic user data from the DB via AuthContext
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    /* Main Layout Container: Standardized Grid spacing */
    <div className="max-w-layout mx-auto p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* IDENTITY COL */}
      <aside className="lg:col-span-3 lg:sticky lg:top-[6rem] space-y-6 order-2 lg:order-1">
        <div className="bg-cyan border-3 border-ink p-[2rem] rounded-[1.5rem] shadow-brutal">
          <h1 className="text-h1-m xl:text-h2-d font-black uppercase mb-[1rem] leading-tight tracking-tighter text-center lg:text-left">
            Hey,
            <br />
            <span className="bg-white px-[0.5rem] italic">
              {user?.username || "Viber"}
            </span>
          </h1>
          <p className="text-[0.75rem] font-bold uppercase tracking-widest opacity-60 leading-relaxed text-center lg:text-left">
            Node_Active
          </p>
        </div>

        <div className="bg-pink border-3 border-ink p-[1.5rem] rounded-[1.5rem] shadow-brutal text-white space-y-[1rem]">
          <h2 className="text-[1rem] md:text-[1.125rem] xl:text-xl leading-tight tracking-tighter italic flex items-center gap-[0.5rem]">
            <Activity size={20} /> Share Signal
          </h2>
          <Link to="/create">
            <Button variant="outline" className="w-full text-ink border-ink">
              <PlusCircle size={18} /> New Pulse
            </Button>
          </Link>
        </div>

        <div className="bg-yellow border-3 border-ink p-[1.5rem] rounded-[1.5rem] shadow-brutal text-center lg:text-left space-y-[0.5rem]">
          <p className="text-[0.75rem] font-black uppercase italic tracking-widest leading-tight">
            Current Karma
          </p>
          <p className="text-[3rem] font-black tabular-nums leading-none">
            {user?.karma_score || 0}
          </p>
        </div>
      </aside>

      {/* FEED COL */}
      <main className="lg:col-span-6 space-y-[2.5rem] order-1 lg:order-2">
        <div className="flex flex-col md:flex-row gap-[1rem] items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="SEARCH_FOR_SIGNALS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-brutal w-full pr-12"
            />
            <Search className="absolute right-4 top-4 opacity-40" />
          </div>
        </div>

        <section className="space-y-[1.5rem]">
          <div className="flex items-center justify-between mb-[0.5rem]">
            <h2 className="text-h2-m xl:text-h2-d font-black italic uppercase tracking-tighter underline decoration-violet decoration-[0.5rem] underline-offset-8 leading-tight">
              Live_Signals
            </h2>
            <div className="flex gap-[0.5rem] items-center">
              <span className="w-3 h-3 rounded-full bg-green animate-pulse border-2 border-ink" />
              <span className="text-[0.6rem] xl:text-[0.625rem] font-black uppercase tracking-widest leading-none">
                Real-time Feed
              </span>
            </div>
          </div>

          <PulseFeed
            selectedCategory={activeCategory}
            searchQuery={searchQuery.trim()}
          />
        </section>
      </main>

      {/* LEADERBOARD COL */}
      <aside className="lg:col-span-3 lg:sticky lg:top-[6rem] order-3">
        <div className="bg-white border-3 border-ink rounded-[2rem] shadow-brutal-lg overflow-hidden">
          <div className="p-[1.5rem] border-b-3 border-ink bg-violet text-white">
            <h2 className="text-[1.25rem] font-black uppercase tracking-tighter leading-none">
              Leaderboard
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
