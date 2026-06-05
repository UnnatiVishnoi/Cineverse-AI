import { Link } from "@tanstack/react-router";
import { Film, Github, Twitter, Instagram } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function Footer() {
  const { theme } = useTheme();
  const brand = theme === "cyber" ? "RetroFlix AI" : "CineVerse AI";
  return (
    <footer className="mt-16 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
              <Film className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-gradient">{brand}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Smart, worldwide entertainment discovery — powered by AI that actually understands your taste.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/browse" className="hover:text-foreground">Movies</Link></li>
            <li><Link to="/browse" className="hover:text-foreground">Series</Link></li>
            <li><Link to="/browse" className="hover:text-foreground">Anime</Link></li>
            <li><Link to="/browse" className="hover:text-foreground">Documentaries</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/watchlist" className="hover:text-foreground">Watchlist</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow</h4>
          <div className="flex gap-2">
            <a className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-muted" href="#"><Twitter className="h-4 w-4" /></a>
            <a className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-muted" href="#"><Instagram className="h-4 w-4" /></a>
            <a className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-muted" href="#"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand}. Posters via Picsum placeholders. Built as a portfolio demo.
      </div>
    </footer>
  );
}
