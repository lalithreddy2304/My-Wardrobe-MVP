"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMockUser } from "@/lib/mockAuth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getMockUser();
    router.replace(user ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="h-5 w-44 rounded bg-white/10 animate-pulse" />
        <div className="mt-4 h-4 w-64 rounded bg-white/10 animate-pulse" />
        <div className="mt-8 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
