import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/data";
import { ContentCard } from "./ContentCard";

export function ContentRow({ title, subtitle, items }: { title: string; subtitle?: string; items: Title[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-up">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-muted transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-muted transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="scroll-x flex gap-4 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {items.map(t => <ContentCard key={t.id} t={t} />)}
      </div>
    </section>
  );
}
