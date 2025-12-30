"use client";

import { useMemo, useState } from "react";
import { type ClothingColor, type ClothingStyle } from "@/lib/mockData";
import { useWardrobe } from "@/lib/wardrobeStore";

const COLORS: ClothingColor[] = ["Black", "White", "Navy", "Grey", "Beige", "Blue"];
const STYLES: ClothingStyle[] = ["Casual", "Smart", "Street", "Formal"];
const NEUTRALS = new Set<ClothingColor>(["Black", "White", "Navy", "Grey", "Beige"]);

type Platform = "Amazon" | "Flipkart" | "Myntra";

type PriceRow = {
  platform: Platform;
  price: number;
  shippingDays: number;
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function styleCompat(a: ClothingStyle, b: ClothingStyle) {
  if (a === b) return 2;
  const pair = `${a}-${b}`;
  if (pair === "Smart-Formal" || pair === "Formal-Smart") return 1;
  if (pair === "Casual-Street" || pair === "Street-Casual") return 1;
  if (pair === "Smart-Casual" || pair === "Casual-Smart") return 1;
  return 0;
}

function colorCompat(a: ClothingColor, b: ClothingColor) {
  if (a === b) return 2;
  if (NEUTRALS.has(a) || NEUTRALS.has(b)) return 1;
  return 0;
}

export default function BuyDecisionPage() {
  const { items } = useWardrobe();

  const [dressName, setDressName] = useState("New dress");
  const [dressColor, setDressColor] = useState<ClothingColor>("Black");
  const [dressStyle, setDressStyle] = useState<ClothingStyle>("Casual");

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const priceRows: PriceRow[] = useMemo(() => {
    // deterministic-ish mock based on name+color+style
    const seed = `${dressName}|${dressColor}|${dressStyle}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

    const base = 999 + (h % 1200); // 999..2198
    const deltas = [0, 120, -80];
    const ship = [3, 5, 4];

    return [
      { platform: "Amazon", price: base + deltas[0], shippingDays: ship[0] },
      { platform: "Flipkart", price: base + deltas[1], shippingDays: ship[1] },
      { platform: "Myntra", price: base + deltas[2], shippingDays: ship[2] },
    ];
  }, [dressName, dressColor, dressStyle]);

  const cheapest = useMemo(() => {
    return priceRows.reduce((min, r) => (r.price < min.price ? r : min), priceRows[0]!);
  }, [priceRows]);

  const compatibility = useMemo(() => {
    // For a dress: shoes + jacket are most useful pairings.
    const relevant = items.filter((i) => i.category === "Shoes" || i.category === "Jacket");

    const matches = relevant
      .map((i) => {
        const score = colorCompat(dressColor, i.color) + styleCompat(dressStyle, i.style);
        return { item: i, score };
      })
      .filter((x) => x.score >= 2) // require at least "decent"
      .sort((a, b) => b.score - a.score);

    const shoesMatches = matches.filter((m) => m.item.category === "Shoes").length;
    const jacketMatches = matches.filter((m) => m.item.category === "Jacket").length;
    const totalMatches = matches.length;

    let potential: "High" | "Medium" | "Low" = "Low";
    let explanation = "Limited pairing options in your wardrobe right now.";

    if (totalMatches >= 4 || (shoesMatches >= 1 && jacketMatches >= 1 && totalMatches >= 2)) {
      potential = "High";
      explanation = "You have strong pairings (shoes + layer) and the color/style will be easy to reuse.";
    } else if (totalMatches >= 1) {
      potential = "Medium";
      explanation = "Some good matches exist, but you may repeat the same pairings often.";
    }

    const label =
      potential === "High"
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/20"
        : potential === "Medium"
          ? "bg-amber-500/15 text-amber-200 border-amber-500/20"
          : "bg-rose-500/15 text-rose-200 border-rose-500/20";

    return { matches, totalMatches, potential, explanation, label };
  }, [dressColor, dressStyle, items]);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Should I Buy This?</h2>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Upload a dress photo (mock), then we estimate wardrobe compatibility and show a basic price comparison.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Dress input</div>
              <div className="mt-1 text-sm text-white/60">Upload a photo, then choose color/style (no AI).</div>
            </div>

            <label className="h-10 px-3 rounded-xl border border-white/10 bg-white/[0.04] text-sm hover:bg-white/[0.08] transition grid place-items-center cursor-pointer">
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = typeof reader.result === "string" ? reader.result : null;
                    if (result) setImageUrl(result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
              <div className="relative aspect-[3/2]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Uploaded dress"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent" />
                    <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                      No photo uploaded yet
                    </div>
                  </>
                )}
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs text-white/60">Dress name</span>
              <input
                value={dressName}
                onChange={(e) => setDressName(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition"
                placeholder="e.g., Black midi dress"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-white/60">Color</span>
                <select
                  value={dressColor}
                  onChange={(e) => setDressColor(e.target.value as ClothingColor)}
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
                <span className="text-xs text-white/60">Style</span>
                <select
                  value={dressStyle}
                  onChange={(e) => setDressStyle(e.target.value as ClothingStyle)}
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
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Compatibility result</div>
              <div className="mt-1 text-sm text-white/60">
                Based on your <span className="text-white/70">shoes + jackets</span> (most useful for dresses).
              </div>
            </div>

            <div className={`rounded-full border px-3 py-1 text-xs ${compatibility.label}`}>
              Usage potential: <span className="font-semibold">{compatibility.potential}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-sm font-semibold">
              Matches with {compatibility.totalMatches} item{compatibility.totalMatches === 1 ? "" : "s"} you already own
            </div>
            <div className="mt-1 text-sm text-white/60">{compatibility.explanation}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              {compatibility.matches.slice(0, 8).map((m) => (
                <span
                  key={m.item.id}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                >
                  {m.item.category} • {m.item.color} • {m.item.style}
                </span>
              ))}
              {compatibility.totalMatches === 0 && (
                <span className="text-xs text-white/55">Tip: add a neutral shoe or a jacket for versatility.</span>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-sm font-semibold tracking-tight">Quick rationale</div>
            <ul className="mt-2 grid gap-2 text-sm text-white/70">
              <li>
                • Neutral colors (black/white/grey/navy/beige) increase reuse across outfits.
              </li>
              <li>• Style alignment (casual ↔ street, smart ↔ formal) improves pairing quality.</li>
              <li>• For dresses, shoes + outer layers give the biggest outfit variety.</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold tracking-tight">Price comparison (mock)</div>
            <div className="mt-1 text-sm text-white/60">Static demo prices across marketplaces.</div>
          </div>
          <div className="text-xs text-white/60">
            Cheapest: <span className="text-white/80 font-semibold">{cheapest.platform}</span> (
            {formatINR(cheapest.price)})
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {priceRows.map((r) => {
            const isCheapest = r.platform === cheapest.platform;
            return (
              <div
                key={r.platform}
                className={[
                  "rounded-2xl border p-4 transition",
                  isCheapest
                    ? "border-emerald-500/25 bg-emerald-500/10"
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{r.platform}</div>
                  {isCheapest && (
                    <span className="text-[11px] rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2 py-0.5 text-emerald-200">
                      Cheapest
                    </span>
                  )}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{formatINR(r.price)}</div>
                <div className="mt-1 text-xs text-white/60">Est. delivery: {r.shippingDays} days</div>

                <button
                  type="button"
                  className="mt-4 w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/80 hover:bg-white/[0.08] transition"
                  onClick={() => {
                    // demo only; no payments, no external navigation required
                    window.alert(`Demo: would open ${r.platform} for "${dressName}".`);
                  }}
                >
                  View on {r.platform}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
