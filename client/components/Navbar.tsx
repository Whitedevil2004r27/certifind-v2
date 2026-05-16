"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookMarked, Menu, Radio, Sparkles, X } from "lucide-react";
import { isClerkEnabled } from "@/lib/auth-config";

const baseNavLinks = [
  { href: "/", label: "Home", color: "hover:text-white" },
  { href: "/courses/live", label: "Live Courses", color: "hover:text-cyan-300", icon: Radio },
  { href: "/free-courses", label: "Free Courses", color: "hover:text-emerald-400" },
  { href: "/paid-courses", label: "Paid Courses", color: "hover:text-amber-400", protected: true },
  { href: "/analyzer", label: "Career Hub", color: "hover:text-blue-400", icon: Sparkles },
  { href: "/bookmarks", label: "Bookmarks", color: "hover:text-rose-400", icon: BookMarked, protected: true },
];

const AuthControls = dynamic(
  () =>
    isClerkEnabled()
      ? import("@/components/auth/ClerkNavbarControls")
      : import("@/components/auth/LegacyNavbarControls"),
  {
    ssr: false,
    loading: () => <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 animate-pulse" />,
  }
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
            <AuthControls />
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
            <AuthControls mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
