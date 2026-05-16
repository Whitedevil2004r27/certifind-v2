"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

type Props = {
  mobile?: boolean;
  onClose?: () => void;
};

function getAvatarUrl(user: any) {
  return (
    user?.image ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      user?.name || user?.email || "U"
    )}&backgroundType=gradientLinear&fontSize=40`
  );
}

export default function LegacyNavbarControls({ mobile = false, onClose }: Props) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";

  const handleLogin = () => {
    signIn();
    onClose?.();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    onClose?.();
  };

  if (loading) {
    return <div className={mobile ? "h-11 rounded-xl bg-white/5" : "h-10 w-10 rounded-full border border-white/10 bg-white/5 animate-pulse"} />;
  }

  if (mobile) {
    if (!user) {
      return (
        <button
          onClick={handleLogin}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-black"
        >
          <User className="h-4 w-4 text-blue-600" /> Sign In
        </button>
      );
    }

    return (
      <button
        onClick={handleLogout}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-6 py-3 text-sm font-black text-rose-400"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="group relative flex w-9 items-center justify-center gap-2 overflow-hidden rounded-full bg-white py-2 text-sm font-black text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:w-auto sm:px-6 sm:py-2.5"
      >
        <User className="h-4 w-4 text-blue-600" />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2 transition-all hover:border-certifind-accent/40">
      <Image
        src={getAvatarUrl(user)}
        alt="User Avatar"
        width={40}
        height={40}
        className="h-8 w-8 rounded-full border-2 border-white/10 object-cover sm:h-10 sm:w-10"
        referrerPolicy="no-referrer"
        unoptimized
      />
      <Link href="/dashboard" className="hidden flex-col pr-1 sm:flex">
        <span className="mb-0.5 text-sm font-black leading-none tracking-tight text-white">
          {user.name?.split(" ")[0] || user.email?.split("@")[0] || "Scholar"}
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.1em] text-certifind-accent">
          Member
        </span>
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-full p-1.5 text-neutral-500 transition-all hover:bg-rose-500/10 hover:text-rose-400 sm:p-2"
        title="Sign out"
      >
        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}
