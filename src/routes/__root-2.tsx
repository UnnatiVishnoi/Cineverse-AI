import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "../lib/theme";
import { GlobalAIChat } from "../components/GlobalAIChat";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the multiverse</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page slipped through a wormhole.</p>
        <Link to="/" className="mt-6 inline-flex px-5 py-2.5 rounded-full font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something flickered.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 inline-flex px-5 py-2.5 rounded-full font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CineVerse AI — Discover what to watch next" },
      { name: "description", content: "AI-powered recommendations for movies, web series, K-dramas, anime and documentaries from around the world." },
      { property: "og:title", content: "CineVerse AI" },
      { property: "og:description", content: "Smart, worldwide entertainment discovery powered by AI." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&family=Orbitron:wght@500;700;800&family=Rajdhani:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Outlet />
        <GlobalAIChat />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
