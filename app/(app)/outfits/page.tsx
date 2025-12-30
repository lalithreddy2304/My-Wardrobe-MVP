"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  mockMatchSuggestions,
  mockOccasionOutfits,
  mockWardrobe,
  type ClothingColor,
  type ClothingStyle,
  type Occasion,
} from "@/lib/mockData";
import { useWardrobe } from "@/lib/wardrobeStore";

function byIds(ids: string[]) {
  const map = new Map(mockWardrobe.map((i) => [i.id, i] as const));
  return ids.map((id) => map.get(id)).filter(Boolean);
}

const CATEGORIES: ClothingCategory[] = ["Shirt", "Pant", "T-shirt", "Shoes", "Jacket"];

export default function OutfitsPage() {
  const { items } = useWardrobe();
  const wardrobe = items?.length ? items : mockWardrobe;

  const wardrobeMap = useMemo(() => new Map(wardrobe.map((i) => [i.id, i] as const)), [wardrobe]);

  const OCCASIONS: Occasion[] = ["College", "Office", "Casual", "Party"];
  const COLORS: Array<ClothingColor | "Any"> = ["Any", "Black", "White", "Navy", "Grey", "Beige", "Blue"];
  const STYLES: Array<ClothingStyle | "Any"> = ["Any", "Casual", "Smart", "Street", "Formal"];

  const [occasion, setOccasion] = useState<Occasion>("College");
  const [preferredColor, setPreferredColor] = useState<ClothingColor | "Any">("Any");
  const [preferredStyle, setPreferredStyle] = useState<ClothingStyle | "Any">("Any");

  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiJson, setAiJson] = useState<{
    paletteAdvice?: string;
    outfits?: Array<{ title: string; itemIds: string[]; reason: string; colorStory?: string }>;
    notes?: string[];
  } | null>(null);

  async function askAI() {
    setLoading(true);
    setAiError(null);
    try {
      const message = [
        `Suggest 3 outfits for ${occasion}.`,
        preferredColor === "Any" ? "Prefer versatile neutrals where possible." : `Prefer ${preferredColor} as a key color.`,
        preferredStyle === "Any" ? "Any style is fine." : `Prefer a ${preferredStyle.toLowerCase()} vibe.`,
        "Only use items from my wardrobe list.",
        "Keep reasons short and practical.",
      ].join(" ");

      const res = await fetch("/api/ai/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, wardrobe }),
      });
      const data = (await res.json()) as { content?: string; error?: string; detail?: string };
      if (!res.ok) throw new Error(data.error ?? "AI request failed");

      const parsed = JSON.parse(data.content ?? "{}") as typeof aiJson;
      setAiJson(parsed);
    } catch (e) {
      setAiJson(null);
      setAiError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Outfit Suggestions</h2>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Showing only full matching outfits (no single-item picker).
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">AI stylist assistant</div>
            <div className="mt-1 text-sm text-white/60">
              Pick a quick preference and generate outfit + color suggestions (no chat box).
            </div>
          </div>

          <button
            type="button"
            onClick={askAI}
            disabled={loading}
            className="h-11 px-4 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-white/90 transition disabled:opacity-60"
          >
            {loading ? "Thinking…" : "Generate AI outfits"}
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Occasion</span>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as Occasion)}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o} className="bg-slate-950">
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-white/60">Preferred color</span>
              <select
                value={preferredColor}
                onChange={(e) => setPreferredColor(e.target.value as ClothingColor | "Any")}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
              >
                {COLORS.map((c) => (
                  <option key={c} value={c} className="bg-slate-950">
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-white/60">Preferred style</span>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value as ClothingStyle | "Any")}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s} className="bg-slate-950">
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {aiError && (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
              {aiError}
            </div>
          )}

          {aiJson?.paletteAdvice && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-semibold">Color advice</div>
              <div className="mt-1 text-sm text-white/70">{aiJson.paletteAdvice}</div>
            </div>
          )}

          {!!aiJson?.outfits?.length && (
            <div className="grid gap-3">
              {aiJson.outfits.slice(0, 3).map((o, idx) => (
                <div key={`${o.title}-${idx}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{o.title}</div>
                      <div className="mt-1 text-xs text-white/60">{o.reason}</div>
                      {o.colorStory && <div className="mt-1 text-xs text-white/55">{o.colorStory}</div>}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {o.itemIds.map((id) => {
                      const it = wardrobeMap.get(id);
                      if (!it) return null;
                      return (
                        <span
                          key={id}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                        >
                          {it.name} • {it.category} • {it.color}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-3">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Matching outfits (mock)</div>
              <div className="mt-1 text-sm text-white/60">Shows explanation text like a real product.</div>
            </div>
            <div className="text-xs text-white/55">1–3 results</div>
          </div>

          <div className="mt-4 grid gap-3">
            {mockMatchSuggestions.map((s) => {
              const itemsForMock = s.itemIds.map((id) => wardrobeMap.get(id)).filter(Boolean);
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="mt-1 text-xs text-white/60">{s.reason}</div>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="h-9 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/70 opacity-70 cursor-not-allowed"
                      title="Save/share later (not in MVP scope)"
                    >
                      Save (next)
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {itemsForMock.map((it) => (
                      <span
                        key={it!.id}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                      >
                        {it!.category} • {it!.color}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      </section>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href="/buy"
          className="h-11 px-4 rounded-xl bg-white text-slate-950 text-sm font-semibold grid place-items-center hover:bg-white/90 transition"
        >
          Should I Buy This?
        </Link>
      </div>
    </div>
  );
}
