"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, User } from "lucide-react";

type Props = {
  mobile?: boolean;
  onClose?: () => void;
};

export default function ClerkNavbarControls({ mobile = false, onClose }: Props) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className={mobile ? "h-11 rounded-xl bg-white/5" : "h-10 w-10 rounded-full border border-white/10 bg-white/5 animate-pulse"} />;
  }

  if (mobile) {
    if (!isSignedIn) {
      return (
        <Link
          href="/login"
          onClick={onClose}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-black"
        >
          <User className="h-4 w-4 text-blue-600" /> Sign In
        </Link>
      );
    }

    return (
      <Link
        href="/dashboard"
        onClick={onClose}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-black text-cyan-100"
      >
        <LayoutDashboard className="h-4 w-4" /> Dashboard
      </Link>
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/login"
        className="group relative flex w-9 items-center justify-center gap-2 overflow-hidden rounded-full bg-white py-2 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:w-auto sm:px-6 sm:py-2.5"
      >
        <User className="h-4 w-4 text-blue-600" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
      <Link
        href="/dashboard"
        className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-300/10 sm:flex"
      >
        <LayoutDashboard className="h-4 w-4" /> Dashboard
      </Link>
      <UserButton />
    </div>
  );
}
