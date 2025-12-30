import { mockWardrobe, type ClothingCategory } from "@/lib/mockData";

const CATEGORIES: ClothingCategory[] = ["Shirt", "Pant", "T-shirt", "Shoes", "Jacket"];

export default function WardrobePage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Your Wardrobe</h2>
          <p className="mt-2 text-sm text-white/60 max-w-2xl">
            A clean grid of your items. Add/remove + category filtering will be implemented next.
          </p>
        </div>

        <button
          type="button"
          disabled
          className="h-11 rounded-xl bg-white text-slate-950 text-sm font-semibold px-4 opacity-60 cursor-not-allowed"
          title="Coming in the next step"
        >
          + Add item (next)
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-white/55 self-center mr-1">Categories:</span>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            disabled
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75 opacity-70 cursor-not-allowed"
            title="Filtering comes next"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {mockWardrobe.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden hover:bg-white/[0.06] transition"
          >
            <div className="relative aspect-[3/4]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent">
                <div className="text-sm font-semibold tracking-tight">{item.name}</div>
                <div className="mt-1 text-xs text-white/70">
                  {item.category} • {item.color} • {item.style}
                </div>
              </div>
            </div>

            <div className="p-3">
              <button
                type="button"
                disabled
                className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/70 opacity-70 cursor-not-allowed"
                title="Remove comes next"
              >
                Remove (next)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
