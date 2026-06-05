import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIChat } from "@/components/AIChat";

export const Route = createFileRoute("/chat")({ component: Chat });

function Chat() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold">AI Companion</h1>
        <p className="text-muted-foreground mt-1">Tell it a mood, a movie you loved, or a vibe. It explains every pick.</p>
        <div className="mt-6">
          <AIChat embedded />
        </div>
      </div>
      <Footer />
    </div>
  );
}
