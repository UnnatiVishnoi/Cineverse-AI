import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { moods, genres, scoreByMood } from "@/lib/data";
import { Sparkles } from "lucide-react";

export function MoodPicker() {
  const nav = useNavigate();
  const [active, setActive] = useState<string | null>(null);
  const m = active ? moods.find(x => x.id === active) : null;
  const recs = active ? scoreByMood(active).slice(0, 6) : [];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">How are you feeling?</h2>
          <p className="text-sm text-muted-foreground">Mood-based recommendations mapped to genres, themes & where to stream</p>
        </div>
        {active && (
          <button onClick={() => nav({ to: "/browse", search: { mood: active } })} className="text-sm font-semibold text-primary hover:underline">
            See all →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {moods.map(mood => (
          <button
            key={mood.id}
            onClick={() => setActive(prev => prev === mood.id ? null : mood.id)}
            className={`glass rounded-2xl p-4 text-left hover:scale-[1.03] hover:shadow-[var(--shadow-glow)] transition ${active === mood.id ? "ring-2 ring-primary" : ""}`}
          >
            <div className="text-3xl">{mood.emoji}</div>
            <div className="mt-2 font-semibold">{mood.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{mood.match.slice(0,2).join(" · ")}</div>
          </button>
        ))}
      </div>

      {m && (
        <div className="mt-6 glass rounded-3xl p-5 animate-fade-up">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-bold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> {m.label} maps to</span>
            {m.genres.slice(0, 4).map(g => <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">{g}</span>)}
            <span className="text-xs text-muted-foreground">· themes:</span>
            {m.themes.slice(0, 3).map(th => <span key={th} className="text-xs px-2.5 py-1 rounded-full glass">{th}</span>)}
            <span className="text-xs text-muted-foreground">· on:</span>
            {m.ott.slice(0, 3).map(o => <span key={o} className="text-xs px-2.5 py-1 rounded-full glass">{o}</span>)}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recs.map(({ title, score, factors }) => (
              <Link
                key={title.id}
                to="/title/$id"
                params={{ id: title.id }}
                className="flex gap-3 rounded-2xl p-3 glass hover:scale-[1.02] transition"
              >
                <img src={title.poster} alt="" className="h-24 w-16 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-sm truncate">{title.title}</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
                      {Math.min(99, 70 + score * 3)}%
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{title.year} · {title.type}</div>
                  <ul className="mt-1 space-y-0.5">
                    {factors.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-[11px] text-foreground/80 flex gap-1"><span className="text-primary">▸</span>{f}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function GenreExplorer() {
  const nav = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Explore by Genre</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map(g => (
          <button
            key={g}
            onClick={() => nav({ to: "/browse", search: { genre: g } })}
            className="px-4 py-2 rounded-full glass text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
          >
            {g}
          </button>
        ))}
      </div>
    </section>
  );
}
