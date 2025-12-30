"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockUser, setMockUser } from "@/lib/mockAuth";

function makeName(email: string) {
  const base = email.split("@")[0] ?? "User";
  return base
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .slice(0, 24);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@mywardrobe.app");
  const [password, setPassword] = useState("password");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim().includes("@") && password.length >= 3, [email, password]);

  useEffect(() => {
    const user = getMockUser();
    if (user) router.replace("/dashboard");
  }, [router]);

  async function signIn(kind: "email" | "google") {
    setSubmitting(true);
    try {
      // Mock auth only for MVP UI step.
      const normalizedEmail = kind === "google" ? "google.user@mywardrobe.app" : email.trim();
      setMockUser({
        id: "user_1",
        email: normalizedEmail,
        name: makeName(normalizedEmail),
      });
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
              MVP • Mock auth • Demo-ready UI
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              My Wardrobe
              <span className="block text-white/70 text-base sm:text-lg font-normal mt-3 max-w-xl">
                Organize your clothes, get quick outfit suggestions, and shop smarter—without overthinking.
              </span>
            </h1>

            <div className="mt-6 grid gap-3 max-w-xl">
              {[
                "Digital wardrobe grid with categories",
                "Outfit matching + occasion shortcuts",
                "“Should I buy this?” compatibility & price comparison (next)",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
              <div className="text-lg font-semibold tracking-tight">Sign in</div>
              <div className="mt-1 text-sm text-white/60">Use demo credentials or continue with Google (mock).</div>

              <div className="mt-6 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-white/60">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
                    placeholder="you@example.com"
                    inputMode="email"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-white/60">Password</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
                    placeholder="••••••••"
                    type="password"
                  />
                </label>

                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() => signIn("email")}
                  className="mt-2 h-11 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:hover:bg-white"
                >
                  {submitting ? "Signing in…" : "Sign in with email"}
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => signIn("google")}
                  className="h-11 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold hover:bg-white/[0.08] transition disabled:opacity-50"
                >
                  Continue with Google (mock)
                </button>

                <div className="pt-2 text-xs text-white/55">
                  No real backend in this step. This stores a demo user in{" "}
                  <span className="text-white/70">localStorage</span>.
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-white/50">
              Tip: After login, use the top navigation to explore the MVP screens.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
