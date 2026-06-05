import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Film, Search, LayoutDashboard, Bookmark, Sparkles, Mic, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

type SREvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SR = { lang: string; interimResults: boolean; onresult: (e: SREvent) => void; onend: () => void; start: () => void };


export function Navbar() {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);

  const startVoice = () => {
    const W = window as unknown as { webkitSpeechRecognition?: new () => SR; SpeechRecognition?: new () => SR };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) { alert("Voice search not supported in this browser."); return; }
    const r = new Ctor();
    r.lang = "en-US"; r.interimResults = false;
    setListening(true);
    r.onresult = (e: SREvent) => {
      const text = e.results[0][0].transcript;
      setQ(text);
      nav({ to: "/browse", search: { q: text } });
    };
    r.onend = () => setListening(false);
    r.start();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav({ to: "/browse", search: { q } });
  };

  const links = [
    { to: "/browse", label: "Browse", icon: Film },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/watchlist", label: "Watchlist", icon: Bookmark },
    { to: "/chat", label: "AI Chat", icon: Sparkles },
  ];

  const brand = theme === "cyber" ? "RetroFlix" : "CineVerse";
  const brandSuffix = "AI";

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground"
               style={{ background: "var(--gradient-hero)" }}>
            <Film className="h-5 w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            <span className="text-gradient">{brand}</span>
            <span className="ml-1 text-muted-foreground text-xs align-middle">{brandSuffix}</span>
          </span>
        </Link>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search movies, anime, K-dramas, documentaries…"
            className="w-full glass rounded-full pl-10 pr-12 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          <button
            type="button"
            onClick={startVoice}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full transition ${listening ? "bg-primary text-primary-foreground animate-pulse-glow" : "bg-muted hover:bg-accent"}`}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-full text-sm transition flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          className="h-10 w-10 grid place-items-center rounded-full glass hover:scale-105 transition"
          aria-label="Toggle theme"
          title={theme === "pastel" ? "Switch to Cyberpunk" : "Switch to Pastel"}
        >
          {theme === "pastel" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <Link
          to="/auth"
          className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
        >
          Sign in
        </Link>
      </div>

      {/* mobile search */}
      <form onSubmit={submit} className="md:hidden px-4 pb-3 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search titles…"
          className="w-full glass rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </form>
    </header>
  );
}

