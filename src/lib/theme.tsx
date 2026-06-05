import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "pastel" | "cyber";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("pastel");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("cv-theme")) as Theme | null;
    if (saved === "pastel" || saved === "cyber") setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("theme-cyber", theme === "cyber");
    document.documentElement.classList.toggle("dark", theme === "cyber");
    try { localStorage.setItem("cv-theme", theme); } catch {}
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle: () => setTheme(theme === "pastel" ? "cyber" : "pastel") }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
}
