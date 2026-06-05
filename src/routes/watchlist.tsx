import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";
import { useLocalList } from "@/lib/store";
import { findById, type Title } from "@/lib/data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/watchlist")({ component: Watchlist });

function Watchlist() {
  const [tab, setTab] = useState<"watch" | "fav" | "recent">("watch");
  const watch = useLocalList("cv-watchlist");
  const fav = useLocalList("cv-favorites");
  const recent = useLocalList("cv-recent");

  const ids = tab === "watch" ? watch.ids : tab === "fav" ? fav.ids : recent.ids;
  const items = useMemo(() => ids.map(findById).filter(Boolean) as Title[], [ids]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Your library</h1>
        <div className="mt-5 inline-flex glass rounded-full p-1">
          {([["watch","Watchlist"],["fav","Favorites"],["recent","Recently viewed"]] as const).map(([k,l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${tab === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {items.map(t => <ContentCard key={t.id} t={t} />)}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              Nothing here yet. <Link to="/browse" className="underline">Discover something to add</Link>.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
