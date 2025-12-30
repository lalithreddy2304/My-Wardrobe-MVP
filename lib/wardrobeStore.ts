"use client";

import { useSyncExternalStore } from "react";
import { mockWardrobe, type ClothingItem } from "@/lib/mockData";

const STORAGE_KEY = "mywardrobe.wardrobe.v1";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// ✅ Cache to ensure getSnapshot returns a stable reference when nothing changed
let cachedRaw: string | null = null;
let cachedItems: ClothingItem[] = mockWardrobe;

function ensureSeeded() {
  if (typeof window === "undefined") return;
  console.log(`[ensureSeeded] typeof window: ${typeof window}`);
  const existing = window.localStorage.getItem(STORAGE_KEY);
  console.log(`[ensureSeeded] localStorage getItem. existing: ${existing}`);
  if (existing) {
    cachedRaw = existing;
    // keep cachedItems as-is; it'll be parsed on first read() if needed
    return;
  }

  const seeded = JSON.stringify(mockWardrobe);
  window.localStorage.setItem(STORAGE_KEY, seeded);
  cachedRaw = seeded;
  cachedItems = mockWardrobe;
}

function read(): ClothingItem[] {
  if (typeof window === "undefined") return mockWardrobe;

  ensureSeeded();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  console.log(`[read] raw: ${raw}, cachedRaw: ${cachedRaw}`);

  if (!raw) return mockWardrobe;

  // ✅ If storage string hasn't changed, return the same array reference
  if (raw === cachedRaw) {
    console.log(`[read] cache hit. cachedItems.length: ${cachedItems.length}`);
    return cachedItems;
  }

  try {
    const parsed = JSON.parse(raw) as ClothingItem[];
    cachedRaw = raw;
    cachedItems = Array.isArray(parsed) ? parsed : mockWardrobe;
    console.log(
      `[read] parsed.length: ${Array.isArray(parsed) ? parsed.length : "not array"}, cachedItems.length: ${cachedItems.length}`
    );
    return cachedItems;
  } catch {
    cachedRaw = raw;
    cachedItems = mockWardrobe;
    return cachedItems;
  }
}

function write(items: ClothingItem[]) {
  if (typeof window === "undefined") return;
  console.log(`[write] typeof window: ${typeof window}`);
  const raw = JSON.stringify(items);
  console.log(`[write] JSON.stringify items. items.length: ${items.length}, raw: ${raw}`);
  window.localStorage.setItem(STORAGE_KEY, raw);

  // ✅ Keep cache in sync so snapshots stay stable
  cachedRaw = raw;
  cachedItems = items;
  emit();
  console.log(`[write] emit. cachedRaw: ${cachedRaw}, cachedItems.length: ${cachedItems.length}`);
}

export function subscribeWardrobe(cb: () => void) {
  listeners.add(cb);
  console.log(`[subscribeWardrobe] listeners.size: ${listeners.size}`);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      // ✅ Update cache when another tab writes
      const nextRaw = e.newValue;
      console.log(`[onStorage] nextRaw: ${nextRaw}, cachedRaw: ${cachedRaw}`);
      if (nextRaw != null && nextRaw !== cachedRaw) {
        try {
          const parsed = JSON.parse(nextRaw) as ClothingItem[];
          cachedRaw = nextRaw;
          cachedItems = Array.isArray(parsed) ? parsed : mockWardrobe;
          console.log(
            `[onStorage] parsed.length: ${Array.isArray(parsed) ? parsed.length : "not array"}, cachedItems.length: ${cachedItems.length}`
          );
        } catch {
          cachedRaw = nextRaw;
          cachedItems = mockWardrobe;
        }
      }
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  console.log(`[subscribeWardrobe] addEventListener storage`);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function getWardrobeSnapshot() {
  return read();
}

export function useWardrobe() {
  const items = useSyncExternalStore(
    subscribeWardrobe,
    getWardrobeSnapshot,
    () => mockWardrobe
  );

  return {
    items,
    addItem: (item: ClothingItem) => {
      const next = [item, ...read()];
      write(next);
    },
    removeItem: (id: string) => {
      const next = read().filter((i) => i.id !== id);
      write(next);
    },
    resetToDemo: () => {
      write(mockWardrobe);
    },
  };
}
