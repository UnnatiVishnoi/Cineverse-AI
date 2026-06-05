import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Plus, Sparkles, Star } from "lucide-react";
import { trending } from "@/lib/data";

export function Hero() {
  const featured = trending.slice(0, 5);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);
  const t = featured[i];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute inset-0 cyber-grid opacity-0 cyber:opacity-100" />

      {/* floating posters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {featured.map((f, k) => (
          <img
            key={f.id}
            src={f.poster}
            alt=""
            className="absolute rounded-2xl shadow-2xl opacity-40 animate-float"
            style={{
              width: 140 + (k % 3) * 30,
              top: `${10 + k * 14}%`,
              right: `${5 + (k * 7) % 25}%`,
              transform: `rotate(${(k % 2 ? 1 : -1) * (4 + k)}deg)`,
              animationDelay: `${k * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 grid lg:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Recommendations
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05]">
            Discover what to <span className="text-gradient">watch next</span>
            <br />— curated for you.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
            Movies, web series, K-dramas, anime, and documentaries from every corner of the world. Mood-based picks, smart match scores, and an AI companion that explains every recommendation.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/title/$id"
              params={{ id: t.id }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
            >
              <Play className="h-4 w-4 fill-current" />
              Watch the spotlight
            </Link>
            <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold glass">
              <Plus className="h-4 w-4" />
              Explore library
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div><div className="text-2xl font-bold text-foreground">30k+</div>Titles</div>
            <div><div className="text-2xl font-bold text-foreground">120+</div>Countries</div>
            <div><div className="text-2xl font-bold text-foreground">14</div>OTT platforms</div>
          </div>
        </div>

        {/* Spotlight card */}
        <Link
          to="/title/$id"
          params={{ id: t.id }}
          key={t.id}
          className="relative animate-fade-up glass rounded-3xl overflow-hidden shadow-[var(--shadow-glow)] block"
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/11]">
            <img src={t.backdrop} alt={t.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="flex gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-full glass">{t.type}</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
                  {t.match}% match
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold">{t.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm opacity-90">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {t.rating.toFixed(1)} · {t.year} · {t.language} · {t.duration}
              </div>
              <p className="mt-2 text-sm opacity-80 line-clamp-2 max-w-lg">{t.synopsis}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-foreground" : "w-3 bg-muted-foreground/40"}`}
            aria-label={`Slide ${k + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
