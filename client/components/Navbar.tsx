"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { signIn, signOut, useSession } from "next-auth/react";
import { BookMarked, LayoutDashboard, LogOut, Menu, Radio, Sparkles, User, X } from "lucide-react";
import { isClerkEnabled } from "@/lib/auth-config";

const baseNavLinks = [
  { href: "/", label: "Home", color: "hover:text-white" },
  { href: "/courses/live", label: "Live Courses", color: "hover:text-cyan-300", icon: Radio },
  { href: "/free-courses", label: "Free Courses", color: "hover:text-emerald-400" },
  { href: "/paid-courses", label: "Paid Courses", color: "hover:text-amber-400", protected: true },
  { href: "/analyzer", label: "Career Hub", color: "hover:text-blue-400", icon: Sparkles },
  { href: "/bookmarks", label: "Bookmarks", color: "hover:text-rose-400", icon: BookMarked, protected: true },
];

function getAvatarUrl(user: any) {
  return (
    user?.image ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      user?.name || user?.email || "U"
    )}&backgroundType=gradientLinear&fontSize=40`
  );
}

function ClerkAuthControls({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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

function LegacyAuthControls({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const clerkMode = isClerkEnabled();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl transition-all duration-300">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="group flex min-w-0 flex-shrink items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-blue-500/20 blur-md transition-all duration-500 group-hover:bg-blue-500/40" />
              <Image
                src="/favicon.png"
                alt="CertiFind Logo"
                width={40}
                height={40}
                className="relative h-8 w-8 rounded-full border border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10"
              />
            </div>
            <span className="hidden truncate text-2xl font-black tracking-tighter text-white transition-all group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] min-[430px]:inline sm:text-3xl">
              Certi<span className="text-blue-500">Find</span>
            </span>
          </Link>

          <div className="hidden items-center space-x-1 lg:flex">
            {baseNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.protected ? false : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:bg-white/5 ${link.color}`}
                >
                  {link.label}
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {clerkMode ? <ClerkAuthControls /> : <LegacyAuthControls />}
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-4">
            {baseNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.protected ? false : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/5 ${link.color}`}
                >
                  {link.label}
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                </Link>
              );
            })}
            {clerkMode ? (
              <ClerkAuthControls mobile onClose={() => setMobileOpen(false)} />
            ) : (
              <LegacyAuthControls mobile onClose={() => setMobileOpen(false)} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
