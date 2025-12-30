import Link from "next/link";
import { mockOccasionOutfits, mockWardrobe } from "@/lib/mockData";

export default function DashboardPage() {
  const total = mockWardrobe.length;
  const categories = Array.from(new Set(mockWardrobe.map((i) => i.category))).length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-white/60 max-w-2xl">
          A clean, fast overview—so you can pick outfits and shop with confidence.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs text-white/60">Items in wardrobe</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{total}</div>
          <div className="mt-2 text-sm text-white/60">Mock data for MVP UI</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs text-white/60">Categories covered</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{categories}</div>
          <div className="mt-2 text-sm text-white/60">Shirt • Pant • T-shirt • Shoes • Jacket</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs text-white/60">Quick start</div>
          <div className="mt-3 grid gap-2">
            <Link
              href="/wardrobe"
              className="h-10 rounded-xl bg-white text-slate-950 text-sm font-semibold grid place-items-center hover:bg-white/90 transition"
            >
              Open Wardrobe
            </Link>
            <Link
              href="/outfits"
              className="h-10 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold grid place-items-center hover:bg-white/[0.08] transition"
            >
              Get Outfit Suggestions
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold tracking-tight">Occasion shortcuts (preview)</div>
            <div className="mt-1 text-sm text-white/60">One-tap full outfit suggestions (logic comes next).</div>
          </div>
          <Link
            href="/outfits"
            className="text-sm text-white/80 hover:text-white transition underline decoration-white/20 hover:decoration-white/40"
          >
            View outfits
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(mockOccasionOutfits).map(([occasion, outfit]) => (
            <div
              key={occasion}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{occasion}</div>
                <div className="text-xs text-white/55">{outfit.itemIds.length} pieces</div>
              </div>
              <div className="mt-2 text-sm text-white/70">{outfit.title}</div>
              <div className="mt-1 text-xs text-white/55">{outfit.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
