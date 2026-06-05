import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ContentRow } from "@/components/ContentRow";
import { MoodPicker, GenreExplorer } from "@/components/Mood";
import { Footer } from "@/components/Footer";
import { byType, forYou, trending } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <ContentRow title="Trending Worldwide" subtitle="What everyone's watching right now" items={trending} />
      <ContentRow title="Recommended for You" subtitle="AI picks tuned to your taste graph" items={forYou} />
      <MoodPicker />
      <ContentRow title="K-Dramas to binge" subtitle="From Seoul, with love" items={byType("K-Drama")} />
      <ContentRow title="Anime spotlight" subtitle="Hand-picked from Japan" items={byType("Anime")} />
      <ContentRow title="Documentaries that hit" subtitle="True stories, beautifully told" items={byType("Documentary")} />
      <GenreExplorer />
      <ContentRow title="Acclaimed Series" subtitle="Critic & community favorites" items={byType("Series")} />

      <Footer />
    </div>
  );
}
