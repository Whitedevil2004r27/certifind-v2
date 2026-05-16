"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookMarked, Loader2, ShieldCheck, User, Zap } from "lucide-react";
import RealtimeCourseModule from "@/components/courses/RealtimeCourseModule";

type DashboardUser = {
  email: string;
  image?: string | null;
  name: string;
  provider: "clerk" | "legacy";
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/me", { cache: "no-store" })
      .then(async (response) => {
        if (!mounted) return;
        if (!response.ok) {
          setUser(null);
          return;
        }

        setUser(await response.json());
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-certifind-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-cyan-300" />
          <h1 className="text-3xl font-black text-white">Dashboard locked</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to open your real-time course workspace and saved learning queue.
          </p>
          <Link href="/login?callbackUrl=/dashboard" className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-black text-black">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const roleClass = {
    admin: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    premium: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    student: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  }[user.role] || "border-white/10 bg-white/[0.045] text-slate-300";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/35">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <User className="h-9 w-9 text-cyan-300" />
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${roleClass}`}>
                    {user.role}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {user.provider === "clerk" ? "Clerk auth" : "Local auth"}
                  </span>
                </div>
                <h1 className="truncate text-3xl font-black text-white sm:text-4xl">{user.name}</h1>
                <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/bookmarks" className="rounded-[2rem] border border-rose-300/20 bg-rose-300/10 p-6 transition hover:bg-rose-300/15">
              <BookMarked className="mb-4 h-6 w-6 text-rose-200" />
              <h2 className="text-lg font-black text-white">Saved courses</h2>
              <p className="mt-2 text-sm text-rose-100/60">Review your bookmarked modules.</p>
            </Link>
            <Link href="/analyzer" className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 transition hover:bg-amber-300/15">
              <Zap className="mb-4 h-6 w-6 text-amber-200" />
              <h2 className="text-lg font-black text-white">Career hub</h2>
              <p className="mt-2 text-sm text-amber-100/60">Analyze skill gaps and next steps.</p>
            </Link>
          </div>
        </section>

        <RealtimeCourseModule variant="dashboard" signedInName={user.name.split(" ")[0] || user.name} />
      </div>
    </main>
  );
}
