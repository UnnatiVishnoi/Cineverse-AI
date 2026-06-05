import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Sparkles, Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: Auth });

function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); nav({ to: "/dashboard" }); };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative min-h-[80vh] grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 cyber-grid opacity-60" />
          <div className="relative h-full flex flex-col justify-center p-12">
            <Sparkles className="h-10 w-10" />
            <h2 className="mt-4 text-4xl font-display font-extrabold leading-tight">
              Your taste is the algorithm.
            </h2>
            <p className="mt-3 text-foreground/80 max-w-md">
              Sign in to unlock mood-based picks, AI explanations, and a watchlist that follows you everywhere.
            </p>
          </div>
        </div>

        <div className="grid place-items-center p-6 sm:p-12">
          <form onSubmit={submit} className="w-full max-w-md glass rounded-3xl p-8 shadow-[var(--shadow-glow)]">
            <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="text-sm text-muted-foreground mt-1">{mode === "login" ? "Sign in to continue" : "Start your AI-curated journey"}</p>

            <div className="mt-6 space-y-3">
              {mode === "signup" && (
                <Field icon={<User className="h-4 w-4" />} type="text" placeholder="Full name" />
              )}
              <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email address" />
              <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password" />
            </div>

            <button className="mt-6 w-full py-3 rounded-full font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
              {mode === "login" ? "Sign in" : "Create account"}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="py-2.5 rounded-full glass text-sm font-medium hover:bg-muted">Google</button>
              <button type="button" className="py-2.5 rounded-full glass text-sm font-medium hover:bg-muted">Apple</button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="underline font-semibold text-foreground">
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input {...props} className="w-full rounded-full pl-10 pr-4 py-3 bg-card border border-border outline-none focus:ring-2 focus:ring-ring text-sm" required />
    </div>
  );
}
