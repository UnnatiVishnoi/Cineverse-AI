import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContentCard } from "@/components/ContentCard";
import { titles, otts, genres, moods, type Title } from "@/lib/data";
import { useProvideAIFilters } from "@/lib/aiContext";
import { Copy, Check } from "lucide-react";
import { z } from "zod";

const SORTS = ["popularity", "rating", "recency", "confidence"] as const;
type Sort = typeof SORTS[number];

const search = z.object({
  q: z.string().optional(),
  genre: z.string().optional(),
  ott: z.string().optional(),
  mood: z.string().optional(),
  type: z.string().optional(),
  language: z.string().optional(),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  sort: z.enum(SORTS).optional(),
});

export const Route = createFileRoute("/browse")({
  validateSearch: search,
  component: Browse,
});

const types: Array<Title["type"] | "All"> = ["All", "Movie", "Series", "Anime", "K-Drama", "Documentary"];
const languages = ["All", ...Array.from(new Set(titles.map(t => t.language))).sort()];
const allYears = titles.map(t => t.year);
const MIN_YEAR = Math.min(...allYears);
const MAX_YEAR = Math.max(...allYears);

const sorters: Record<Sort, (a: Title, b: Title) => number> = {
  popularity: (a, b) => (b.rating * 0.55 + b.match * 0.045) - (a.rating * 0.55 + a.match * 0.045),
  rating: (a, b) => b.rating - a.rating,
  recency: (a, b) => b.year - a.year,
  confidence: (a, b) => b.match - a.match,
};

const sortLabels: Record<Sort, string> = {
  popularity: "Popularity",
  rating: "Audience rating",
  recency: "Recency",
  confidence: "AI confidence",
};

function Browse() {
  const initial = Route.useSearch();
  const nav = useNavigate({ from: "/browse" });

  const [q, setQ] = useState(initial.q ?? "");
  const [type, setType] = useState<string>(initial.type ?? "All");
  const [genre, setGenre] = useState<string>(initial.genre ?? "All");
  const [ott, setOtt] = useState<string>(initial.ott ?? "All");
  const [mood, setMood] = useState<string>(initial.mood ?? "All");
  const [language, setLanguage] = useState<string>(initial.language ?? "All");
  const [yearFrom, setYearFrom] = useState<number>(initial.yearFrom ?? MIN_YEAR);
  const [yearTo, setYearTo] = useState<number>(initial.yearTo ?? MAX_YEAR);
  const [sort, setSort] = useState<Sort>(initial.sort ?? "popularity");
  const [copied, setCopied] = useState(false);

  // Sync state -> URL (replace so back-button isn't spammed)
  useEffect(() => {
    const next: Record<string, unknown> = {};
    if (q) next.q = q;
    if (type !== "All") next.type = type;
    if (genre !== "All") next.genre = genre;
    if (ott !== "All") next.ott = ott;
    if (mood !== "All") next.mood = mood;
    if (language !== "All") next.language = language;
    if (yearFrom !== MIN_YEAR) next.yearFrom = yearFrom;
    if (yearTo !== MAX_YEAR) next.yearTo = yearTo;
    if (sort !== "popularity") next.sort = sort;
    nav({ search: next as never, replace: true });
  }, [q, type, genre, ott, mood, language, yearFrom, yearTo, sort, nav]);

  // Share with AI chat
  useProvideAIFilters({
    q: q || undefined,
    type: type === "All" ? undefined : type,
    genre: genre === "All" ? undefined : genre,
    ott: ott === "All" ? undefined : ott,
    language: language === "All" ? undefined : language,
    mood: mood === "All" ? undefined : mood,
    yearFrom: yearFrom !== MIN_YEAR ? yearFrom : undefined,
    yearTo: yearTo !== MAX_YEAR ? yearTo : undefined,
    sort,
  });

  const list = useMemo(() => {
    const moodTags = moods.find(m => m.id === mood)?.match ?? [];
    const ql = q.toLowerCase();
    return titles
      .filter(t => {
        if (type !== "All" && t.type !== type) return false;
        if (genre !== "All" && !t.genres.includes(genre)) return false;
        if (ott !== "All" && !t.ott.includes(ott)) return false;
        if (language !== "All" && t.language !== language) return false;
        if (t.year < yearFrom || t.year > yearTo) return false;
        if (mood !== "All" && !t.mood.some(m => moodTags.includes(m))) return false;
        if (ql) {
          const hay = `${t.title} ${t.cast.join(" ")} ${t.director} ${t.genres.join(" ")} ${t.language} ${t.country}`.toLowerCase();
          if (!hay.includes(ql)) return false;
        }
        return true;
      })
      .sort(sorters[sort]);
  }, [q, type, genre, ott, mood, language, yearFrom, yearTo, sort]);

  const reset = () => {
    setQ(""); setType("All"); setGenre("All"); setOtt("All"); setMood("All");
    setLanguage("All"); setYearFrom(MIN_YEAR); setYearTo(MAX_YEAR); setSort("popularity");
  };

  const shareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const activeChips = [
    type !== "All" && { k: "Type", v: type, clear: () => setType("All") },
    genre !== "All" && { k: "Genre", v: genre, clear: () => setGenre("All") },
    ott !== "All" && { k: "OTT", v: ott, clear: () => setOtt("All") },
    language !== "All" && { k: "Language", v: language, clear: () => setLanguage("All") },
    mood !== "All" && { k: "Mood", v: moods.find(m => m.id === mood)?.label ?? mood, clear: () => setMood("All") },
    (yearFrom !== MIN_YEAR || yearTo !== MAX_YEAR) && {
      k: "Year", v: `${yearFrom}–${yearTo}`,
      clear: () => { setYearFrom(MIN_YEAR); setYearTo(MAX_YEAR); },
    },
  ].filter(Boolean) as { k: string; v: string; clear: () => void }[];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Browse the universe</h1>
            <p className="text-muted-foreground mt-1">{list.length} titles · sorted by {sortLabels[sort].toLowerCase()}</p>
          </div>
          <button onClick={shareLink} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full glass">
            {copied ? <><Check className="h-4 w-4 text-primary" /> Copied</> : <><Copy className="h-4 w-4" /> Share these results</>}
          </button>
        </div>

        <div className="mt-6 glass rounded-3xl p-4 sm:p-5 grid gap-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by title, cast, director…"
            className="w-full rounded-full px-5 py-3 glass outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <Select label="Type" value={type} onChange={setType} options={types as string[]} />
            <Select label="Genre" value={genre} onChange={setGenre} options={["All", ...genres]} />
            <Select label="OTT" value={ott} onChange={setOtt} options={["All", ...otts]} />
            <Select label="Language" value={language} onChange={setLanguage} options={languages} />
            <Select label="Mood" value={mood} onChange={setMood} options={["All", ...moods.map(m => m.id)]} display={(v) => v === "All" ? "All" : (moods.find(m => m.id === v)?.label ?? v)} />
            <Select label="Sort" value={sort} onChange={(v) => setSort(v as Sort)} options={SORTS as unknown as string[]} display={(v) => sortLabels[v as Sort] ?? v} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <YearRange label="From" value={yearFrom} min={MIN_YEAR} max={yearTo} onChange={setYearFrom} />
            <YearRange label="To" value={yearTo} min={yearFrom} max={MAX_YEAR} onChange={setYearTo} />
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Active:</span>
              {activeChips.map((c, i) => (
                <button key={i} onClick={c.clear} className="text-xs px-3 py-1 rounded-full glass hover:bg-muted">
                  {c.k}: <b>{c.v}</b> ✕
                </button>
              ))}
              <button onClick={reset} className="ml-auto text-xs font-semibold px-3 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {list.map(t => <ContentCard key={t.id} t={t} />)}
          {list.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No matches. Try clearing a filter.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Select({ label, value, onChange, options, display }: { label: string; value: string; onChange: (v: string) => void; options: string[]; display?: (v: string) => string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl px-3 py-2.5 bg-card border border-border outline-none focus:ring-2 focus:ring-ring text-sm"
      >
        {options.map(o => <option key={o} value={o}>{display ? display(o) : o}</option>)}
      </select>
    </label>
  );
}

function YearRange({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label} year</span>
        <span className="text-sm font-bold text-gradient">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={Math.min(Math.max(value, min), max)}
        onChange={e => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-primary"
      />
    </label>
  );
}
