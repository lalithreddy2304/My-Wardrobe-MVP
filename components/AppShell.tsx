"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearMockUser, getMockUser, type MockUser } from "@/lib/mockAuth";

type NavItem = { href: string; label: string; desc: string };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", desc: "Overview" },
  { href: "/wardrobe", label: "Wardrobe", desc: "Your items" },
  { href: "/outfits", label: "Outfits", desc: "Suggestions" },
  { href: "/buy", label: "Buy", desc: "Worth it?" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getMockUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setReady(true);
  }, [router]);

  const activeHref = useMemo(() => {
    const found = NAV.find((n) => pathname?.startsWith(n.href));
    return found?.href ?? "/dashboard";
  }, [pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 grid place-items-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="h-5 w-44 rounded bg-white/10 animate-pulse" />
          <div className="mt-4 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="mt-3 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-slate-950/70 backdrop-blur border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 grid place-items-center shadow-sm">
                <span className="text-sm font-semibold tracking-tight">MW</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm text-white/70">My Wardrobe</div>
                <div className="text-base font-semibold tracking-tight">Premium outfit clarity</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 grid place-items-center text-xs font-semibold">
                  {user ? initials(user.name) : "U"}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-medium">{user?.name ?? "User"}</div>
                  <div className="text-xs text-white/60">{user?.email ?? ""}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearMockUser();
                  router.replace("/login");
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] hover:text-white transition"
              >
                Log out
              </button>
            </div>
          </div>

          <nav className="mt-4 hidden sm:flex items-center gap-2">
            {NAV.map((item) => {
              const active = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group rounded-2xl border px-4 py-3 transition",
                    active
                      ? "border-white/15 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold tracking-tight">{item.label}</div>
                  <div className="text-xs text-white/60 group-hover:text-white/70">{item.desc}</div>
                </Link>
              );
            })}

            <div className="ml-auto text-xs text-white/55">
              Buy Decision & Price Comparison: <span className="text-white/70">coming next</span>
            </div>
          </nav>
        </header>

        <main className="py-6 sm:py-10">{children}</main>

        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-3 gap-2">
            {NAV.map((item) => {
              const active = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-xl border px-3 py-2 text-center text-sm transition",
                    active ? "border-white/15 bg-white/[0.08]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sm:hidden h-20" />
      </div>
    </div>
  );
}
