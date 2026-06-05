import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, X, MessageSquare, Wand2, ListChecks } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { titles, similar, moods, type Title } from "@/lib/data";
import type { AIFilters } from "@/lib/aiContext";

type Msg = { role: "user" | "ai"; text: string; recs?: Title[] };

const defaultGreeting: Msg = {
  role: "ai",
  text: "Hi, I'm your CineVerse AI companion. Tell me a mood, a vibe, or even just \"something like Parasite\" — I'll find it.",
};

function pick(query: string, context?: Title): Title[] {
  const q = query.toLowerCase();
  const tokens = q.split(/\W+/).filter(Boolean);
  const pool = context ? [context, ...similar(context), ...titles] : titles;
  const seen = new Set<string>();
  return pool
    .filter(t => (seen.has(t.id) ? false : (seen.add(t.id), true)))
    .map(t => {
      const hay = `${t.title} ${t.type} ${t.genres.join(" ")} ${t.mood.join(" ")} ${t.language} ${t.country} ${t.cast.join(" ")} ${t.director}`.toLowerCase();
      let score = tokens.reduce((s, tok) => s + (hay.includes(tok) ? 2 : 0), 0) + Math.random() * 0.5;
      if (context) {
        score += t.genres.filter(g => context.genres.includes(g)).length * 1.2;
        score += t.mood.filter(m => context.mood.includes(m)).length * 1.0;
        if (t.id === context.id) score += 1.5;
      }
      return { t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.t);
}

function reply(query: string, recs: Title[], context?: Title) {
  if (!recs.length) return "I couldn't think of anything — try a mood like \"cozy\" or a vibe like \"mind-bending sci-fi\".";
  const top = recs[0];
  const ctx = context ? ` Since you're viewing ${context.title}, I leaned into its ${context.genres[0]} + ${context.mood[0].toLowerCase()} DNA.` : "";
  return `Based on "${query}", I'd start with ${top.title} (${top.year}) — ${top.match}% match. It blends ${top.genres.slice(0,2).join(" + ")} with a ${top.mood[0].toLowerCase()} tone.${ctx} Here are a few more I think you'll love:`;
}

function explainTitle(t: Title): string {
  return `Here's why ${t.title} (${t.year}) lands at a ${t.match}% match:\n\n• Genre signal: ${t.genres.join(", ")} — a sweet spot for fans of ${t.genres[0]}.\n• Mood profile: ${t.mood.join(" · ")} — expect a ${t.mood[0].toLowerCase()} ride.\n• Pedigree: directed by ${t.director}, starring ${t.cast.slice(0,2).join(" & ")}.\n• Audience: ${t.rating.toFixed(1)}/10 across ${t.country} (${t.language}).\n• Where to stream: ${t.ott.join(", ")}.\n\nIf you like this, here are titles tuned to the same wavelength:`;
}

function whyThisMatches(t: Title | undefined, f: AIFilters): string {
  const lines: string[] = ["**Why this matches**"];
  const active = Object.entries(f).filter(([k, v]) => v !== undefined && v !== "" && v !== "All" && !(k === "yearFrom" || k === "yearTo"));
  if (!t && active.length === 0) {
    return "Open a title or set a filter on Browse and I'll break down the match factors here.";
  }
  if (t) {
    lines.push(`\n**Title in focus:** ${t.title} (${t.year}) — ${t.match}% AI confidence`);
    lines.push(`• Genres: ${t.genres.join(", ")}`);
    lines.push(`• Mood: ${t.mood.join(" · ")}`);
    lines.push(`• Streaming on: ${t.ott.join(", ")}`);
  }
  if (active.length) {
    lines.push(`\n**Filter signals**`);
    if (f.genre && f.genre !== "All") lines.push(`• Genre filter "${f.genre}" → ${t ? (t.genres.includes(f.genre) ? "✅ match" : "⚠️ not present on this title") : "applied"}`);
    if (f.type && f.type !== "All") lines.push(`• Type "${f.type}" → ${t ? (t.type === f.type ? "✅ match" : "⚠️ different type") : "applied"}`);
    if (f.ott && f.ott !== "All") lines.push(`• OTT "${f.ott}" → ${t ? (t.ott.includes(f.ott) ? "✅ available" : "⚠️ not on this platform") : "applied"}`);
    if (f.language && f.language !== "All") lines.push(`• Language "${f.language}" → ${t ? (t.language === f.language ? "✅ match" : "⚠️ different language") : "applied"}`);
    if (f.mood && f.mood !== "All") {
      const m = moods.find(x => x.id === f.mood);
      if (m) {
        const hit = t ? t.mood.filter(x => m.match.includes(x)) : [];
        lines.push(`• Mood "${m.label}" maps to ${m.genres.slice(0,3).join("/")} on ${m.ott.slice(0,2).join(", ")}${t ? ` → ${hit.length ? `✅ vibes hit: ${hit.join(", ")}` : "⚠️ vibe drift"}` : ""}`);
      }
    }
    if (f.yearFrom || f.yearTo) lines.push(`• Year window ${f.yearFrom ?? "…"}–${f.yearTo ?? "…"}${t ? ` → ${t.year} ${(f.yearFrom ?? -Infinity) <= t.year && t.year <= (f.yearTo ?? Infinity) ? "✅" : "⚠️"}` : ""}`);
    if (f.sort) lines.push(`• Sorted by **${f.sort}**`);
    if (f.q) lines.push(`• Free-text query: "${f.q}"`);
  }
  lines.push(`\n**Verdict:** ${t ? (t.match >= 88 ? "Strong recommendation given your filters." : "Decent fit — adjust mood or genre to tighten.") : "Pick a title to see how it scores against your filters."}`);
  return lines.join("\n");
}

function hasActiveFilters(f: AIFilters) {
  return Object.entries(f).some(([k, v]) => v !== undefined && v !== "" && v !== "All" && !(k === "yearFrom" || k === "yearTo"));
}

export function AIChat({ embedded = false, contextTitle, activeFilters }: { embedded?: boolean; contextTitle?: Title; activeFilters?: AIFilters }) {
  const filters = activeFilters ?? {};
  const [open, setOpen] = useState(embedded);
  const greeting = useMemo<Msg>(() => contextTitle
    ? { role: "ai", text: `I see you're checking out ${contextTitle.title}. Want me to explain why it might (or might not) be for you — or find something similar?` }
    : defaultGreeting, [contextTitle?.id]);
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMsgs([greeting]); }, [greeting]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const recs = pick(text, contextTitle);
    setMsgs(prev => [...prev, { role: "user", text }, { role: "ai", text: reply(text, recs, contextTitle), recs }]);
    setInput("");
  };

  const explainCurrent = () => {
    if (!contextTitle) return;
    const recs = similar(contextTitle).slice(0, 4);
    setMsgs(prev => [
      ...prev,
      { role: "user", text: `Explain ${contextTitle.title}` },
      { role: "ai", text: explainTitle(contextTitle), recs },
    ]);
  };

  const why = () => {
    const recs = contextTitle ? similar(contextTitle).slice(0, 4) : [];
    setMsgs(prev => [
      ...prev,
      { role: "user", text: "Why this matches my filters?" },
      { role: "ai", text: whyThisMatches(contextTitle, filters), recs },
    ]);
  };

  const showWhy = contextTitle || hasActiveFilters(filters);

  const Panel = (
    <div className={`flex flex-col ${embedded ? "h-[70vh]" : "h-[520px]"} w-full glass rounded-3xl overflow-hidden shadow-[var(--shadow-glow)]`}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full grid place-items-center text-primary-foreground shrink-0" style={{ background: "var(--gradient-hero)" }}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm">CineVerse AI</div>
            <div className="text-[10px] text-muted-foreground truncate">
              {contextTitle ? `Context: ${contextTitle.title}` : hasActiveFilters(filters) ? "Reading your active filters" : "Online · powered by your taste"}
            </div>
          </div>
        </div>
        {!embedded && (
          <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
        )}
      </div>

      {(contextTitle || showWhy) && (
        <div className="px-3 py-2 border-b border-border/40 flex flex-wrap gap-2">
          {contextTitle && (
            <button onClick={explainCurrent} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
              <Wand2 className="h-3 w-3" /> Explain this title
            </button>
          )}
          {showWhy && (
            <button onClick={why} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full glass">
              <ListChecks className="h-3 w-3" /> Why this matches
            </button>
          )}
          {contextTitle && (
            <button onClick={() => send(`something similar to ${contextTitle.title}`)} className="text-xs font-semibold px-3 py-1.5 rounded-full glass">More like this</button>
          )}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass"} rounded-2xl px-4 py-2.5 text-sm`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.recs && m.recs.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {m.recs.map(t => (
                    <Link key={t.id} to="/title/$id" params={{ id: t.id }} className="flex gap-2 rounded-xl glass p-2 hover:scale-[1.02] transition">
                      <img src={t.poster} alt="" className="h-14 w-10 object-cover rounded-md" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground">{t.match}% · {t.type}</div>
                        <div className="text-[10px] truncate">{t.genres.slice(0,2).join(", ")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-border/40 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={contextTitle ? `Ask about ${contextTitle.title}…` : "Try: cozy K-drama with food…"}
          className="flex-1 rounded-full px-4 py-2.5 text-sm glass outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" className="h-10 w-10 grid place-items-center rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );

  if (embedded) return Panel;

  return (
    <>
      {open ? (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-fade-up">
          {Panel}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-primary-foreground animate-pulse-glow"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <MessageSquare className="h-4 w-4" />
          {contextTitle ? "Ask about this" : "Ask AI"}
        </button>
      )}
    </>
  );
}
