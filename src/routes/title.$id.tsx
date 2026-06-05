import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";
import { findById, similarWithReasons, type Title } from "@/lib/data";
import { useLocalList } from "@/lib/store";
import { useProvideAIContext } from "@/lib/aiContext";
import { useEffect, useState } from "react";
import { Play, Bookmark, Heart, Star, Globe2, Clock, Sparkles, ChevronRight, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/title/$id")({
  loader: ({ params }) => {
    const t = findById(params.id);
    if (!t) throw notFound();
    return { t };
  },
  component: TitlePage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">Not found</div>
  ),
});

function TitlePage() {
  const { t } = Route.useLoaderData() as { t: Title };
  const watch = useLocalList("cv-watchlist");
  const fav = useLocalList("cv-favorites");
  const recent = useLocalList("cv-recent");

  useEffect(() => { recent.push(t.id); /* eslint-disable-next-line */ }, [t.id]);
  useProvideAIContext(t);

  const sims = similarWithReasons(t);
  const [explainSims, setExplainSims] = useState(false);
  const reasons = [
    `Strong match on ${t.genres.slice(0,2).join(" + ")}`,
    `Vibe profile: ${t.mood.slice(0,2).join(", ")}`,
    `Audience score ${t.rating.toFixed(1)} aligns with your top-rated picks`,
  ];

  const reviews = [
    { name: "Aarav", text: "Absolutely cinematic. Couldn't look away.", stars: 5 },
    { name: "Mei", text: "The vibes are immaculate — best of the year for me.", stars: 5 },
    { name: "Jonas", text: "A bit slow in the middle, but the payoff is huge.", stars: 4 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* backdrop */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={t.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--background) 8%, transparent 70%), linear-gradient(to right, var(--background) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-end pb-10">
          <div className="grid sm:grid-cols-[200px,1fr] gap-6 items-end max-w-4xl">
            <img src={t.poster} alt={t.title} className="w-40 sm:w-[200px] rounded-2xl shadow-[var(--shadow-glow)]" />
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded-full glass">{t.type}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>{t.match}% AI match</span>
                {t.ott.slice(0,2).map(o => <span key={o} className="text-xs font-bold px-2 py-1 rounded-full glass">{o}</span>)}
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold">{t.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {t.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {t.duration}</span>
                <span className="flex items-center gap-1"><Globe2 className="h-4 w-4" /> {t.language} · {t.country}</span>
                <span>{t.year}</span>
              </div>
              <p className="mt-3 max-w-2xl text-foreground/85">{t.synopsis}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
                  <Play className="h-4 w-4 fill-current" /> Watch trailer
                </button>
                <button onClick={() => watch.toggle(t.id)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold glass">
                  <Bookmark className={`h-4 w-4 ${watch.has(t.id) ? "fill-current" : ""}`} />
                  {watch.has(t.id) ? "In watchlist" : "Add to watchlist"}
                </button>
                <button onClick={() => fav.toggle(t.id)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold glass">
                  <Heart className={`h-4 w-4 ${fav.has(t.id) ? "fill-current text-primary" : ""}`} /> Favorite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI reasons */}
          <div className="glass rounded-3xl p-6">
            <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5" /> Why this matches you</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2"><ChevronRight className="h-4 w-4 mt-0.5 text-primary" />{r}</li>
              ))}
            </ul>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <Stat label="AI confidence" value={`${t.match}%`} />
              <Stat label="Global popularity" value={`${Math.round(70 + t.rating * 3)}%`} />
              <Stat label="Critic score" value={`${Math.round(60 + t.rating * 4)}%`} />
            </div>
          </div>

          {/* Cast */}
          <div>
            <h2 className="font-bold text-lg mb-3">Cast & Crew</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full glass text-sm"><b>Director:</b> {t.director}</span>
              {t.cast.map(c => <span key={c} className="px-3 py-1.5 rounded-full glass text-sm">{c}</span>)}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-bold text-lg mb-3">Reviews & Ratings</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.name}</div>
                    <div className="flex">{Array.from({ length: r.stars }).map((_,k) => <Star key={k} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <h3 className="font-bold mb-3">Where to watch</h3>
            <div className="flex flex-wrap gap-2">
              {t.ott.map(o => <span key={o} className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground font-medium">{o}</span>)}
            </div>
          </div>
          <div className="glass rounded-3xl p-5">
            <h3 className="font-bold mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {t.genres.map(g => <Link key={g} to="/browse" search={{ genre: g }} className="px-3 py-1.5 rounded-full text-sm glass hover:bg-muted">{g}</Link>)}
            </div>
          </div>
          <div className="glass rounded-3xl p-5">
            <h3 className="font-bold mb-3">Mood</h3>
            <div className="flex flex-wrap gap-2">
              {t.mood.map(m => <span key={m} className="px-3 py-1.5 rounded-full text-sm glass">{m}</span>)}
            </div>
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">More like this</h2>
          <button
            onClick={() => setExplainSims(v => !v)}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${explainSims ? "text-primary-foreground" : "glass"}`}
            style={explainSims ? { background: "var(--gradient-hero)" } : undefined}
          >
            <Lightbulb className="h-4 w-4" />
            {explainSims ? "Hide AI explanations" : "Explain similar picks"}
          </button>
        </div>
        <div className={explainSims ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "scroll-x flex gap-4 pb-4"}>
          {sims.map(({ x, reasons }) => (
            explainSims ? (
              <div key={x.id} className="glass rounded-2xl p-3 flex gap-3">
                <Link to="/title/$id" params={{ id: x.id }} className="shrink-0">
                  <img src={x.poster} alt={x.title} className="h-32 w-20 rounded-lg object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link to="/title/$id" params={{ id: x.id }} className="font-bold text-sm truncate hover:underline">{x.title}</Link>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-primary-foreground shrink-0" style={{ background: "var(--gradient-hero)" }}>
                      {x.match}%
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{x.year} · {x.type} · ⭐ {x.rating.toFixed(1)}</div>
                  <div className="mt-2 text-[11px] font-semibold text-primary flex items-center gap-1"><Sparkles className="h-3 w-3" /> Why this pick</div>
                  <ul className="mt-1 space-y-0.5">
                    {reasons.slice(0, 4).map((r, i) => (
                      <li key={i} className="text-[11px] text-foreground/85 flex gap-1"><span className="text-primary">▸</span>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <ContentCard key={x.id} t={x} />
            )
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4 bg-muted/40">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-gradient mt-1">{value}</div>
    </div>
  );
}
