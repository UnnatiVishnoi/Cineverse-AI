import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";
import { useLocalList } from "@/lib/store";
import { findById, forYou, titles, type Title } from "@/lib/data";
import { useMemo } from "react";
import { TrendingUp, Heart, Bookmark, Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const watch = useLocalList("cv-watchlist");
  const fav = useLocalList("cv-favorites");
  const recent = useLocalList("cv-recent");

  const favItems = useMemo(() => fav.ids.map(findById).filter(Boolean) as Title[], [fav.ids]);
  const watchItems = useMemo(() => watch.ids.map(findById).filter(Boolean) as Title[], [watch.ids]);
  const recentItems = useMemo(() => recent.ids.map(findById).filter(Boolean) as Title[], [recent.ids]);

  const topGenre = useMemo(() => {
    const c: Record<string, number> = {};
    favItems.forEach(t => t.genres.forEach(g => c[g] = (c[g] ?? 0) + 1));
    return Object.entries(c).sort((a,b) => b[1]-a[1])[0]?.[0] ?? "Drama";
  }, [favItems]);

  const taste = useMemo(() => {
    const langs: Record<string, number> = {};
    [...favItems, ...recentItems].forEach(t => langs[t.language] = (langs[t.language] ?? 0) + 1);
    return Object.entries(langs).sort((a,b) => b[1]-a[1]).slice(0, 5);
  }, [favItems, recentItems]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl grid place-items-center text-2xl text-primary-foreground font-bold" style={{ background: "var(--gradient-hero)" }}>
            A
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
            <p className="text-muted-foreground text-sm">Your personalized taste graph</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI icon={<Bookmark className="h-5 w-5" />} label="Watchlist" value={watchItems.length} />
          <KPI icon={<Heart className="h-5 w-5" />} label="Favorites" value={favItems.length} />
          <KPI icon={<Clock className="h-5 w-5" />} label="Recently viewed" value={recentItems.length} />
          <KPI icon={<Sparkles className="h-5 w-5" />} label="Top genre" value={topGenre} />
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <h2 className="font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Your taste graph</h2>
            <p className="text-sm text-muted-foreground">Languages you watch most</p>
            <div className="mt-5 space-y-3">
              {taste.length === 0 && <p className="text-sm text-muted-foreground">Start favoriting titles to build your graph.</p>}
              {taste.map(([lang, count]) => {
                const max = taste[0]?.[1] || 1;
                return (
                  <div key={lang}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium">{lang}</span><span className="text-muted-foreground">{count}</span></div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(count/max)*100}%`, background: "var(--gradient-hero)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h2 className="font-bold flex items-center gap-2"><Sparkles className="h-5 w-5" /> Activity</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span>This week</span><b>{Math.max(3, recentItems.length)} titles</b></li>
              <li className="flex justify-between"><span>Hours watched</span><b>{(recentItems.length * 1.8 + 4).toFixed(1)}h</b></li>
              <li className="flex justify-between"><span>Avg rating</span><b>{(titles.reduce((s,t)=>s+t.rating,0)/titles.length).toFixed(1)}</b></li>
              <li className="flex justify-between"><span>AI match avg</span><b>{Math.round(titles.reduce((s,t)=>s+t.match,0)/titles.length)}%</b></li>
            </ul>
          </div>
        </div>

        <Section title="Continue exploring" items={recentItems.length ? recentItems : forYou.slice(0,8)} />
        <Section title="Recommended for you" items={forYou} />
        <Section title="Your favorites" items={favItems} emptyText="No favorites yet — tap the heart on any title." />
      </div>
      <Footer />
    </div>
  );
}

function KPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}{label}</div>
      <div className="mt-1 text-3xl font-bold text-gradient">{value}</div>
    </div>
  );
}

function Section({ title, items, emptyText }: { title: string; items: Title[]; emptyText?: string }) {
  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          {emptyText ?? "Nothing here yet."}{" "}
          <Link to="/browse" className="underline">Browse the library</Link>
        </div>
      ) : (
        <div className="scroll-x flex gap-4 pb-4">
          {items.map(t => <ContentCard key={t.id} t={t} />)}
        </div>
      )}
    </section>
  );
}
