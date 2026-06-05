import { Link } from "@tanstack/react-router";
import { Star, Play, Heart } from "lucide-react";
import type { Title } from "@/lib/data";
import { useLocalList } from "@/lib/store";

export function ContentCard({ t, size = "md" }: { t: Title; size?: "sm" | "md" | "lg" }) {
  const fav = useLocalList("cv-favorites");
  const isFav = fav.has(t.id);

  const w = size === "lg" ? "w-[240px]" : size === "sm" ? "w-[150px]" : "w-[190px]";
  const h = size === "lg" ? "h-[340px]" : size === "sm" ? "h-[220px]" : "h-[280px]";

  return (
    <Link
      to="/title/$id"
      params={{ id: t.id }}
      className={`group relative shrink-0 ${w} rounded-2xl overflow-hidden glass glow-hover hover:[&]:[transform:translateY(-6px)_scale(1.02)] hover:shadow-[var(--shadow-glow)]`}
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className={`relative ${h} overflow-hidden`}>
        <img
          src={t.poster}
          alt={t.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />

        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="text-[10px] font-bold px-2 py-1 rounded-full glass">{t.type}</span>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}>
            {t.match}% match
          </span>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); fav.toggle(t.id); }}
          className={`absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full glass transition ${isFav ? "text-primary" : "text-white"}`}
          aria-label="Favorite"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className="flex items-center gap-1 text-xs opacity-90">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{t.rating.toFixed(1)}</span>
            <span className="opacity-70">· {t.year} · {t.language}</span>
          </div>
          <h3 className="mt-1 font-display font-bold text-sm leading-tight line-clamp-2">{t.title}</h3>
        </div>

        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition">
          <span className="h-12 w-12 grid place-items-center rounded-full text-primary-foreground"
                style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CardSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const w = size === "lg" ? "w-[240px] h-[340px]" : size === "sm" ? "w-[150px] h-[220px]" : "w-[190px] h-[280px]";
  return <div className={`skeleton rounded-2xl shrink-0 ${w}`} />;
}
