"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const getAvatarUrl = (user: any) => {
    return (
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      user?.user_metadata?.photo ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'U'
      )}&backgroundType=gradientLinear&fontSize=40`
    );
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : '' }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', color: 'hover:text-white' },
    { href: '/free-courses', label: 'Free Courses', color: 'hover:text-emerald-400' },
    { href: '/paid-courses', label: 'Paid Courses', color: 'hover:text-amber-400' },
    { href: '/analyzer', label: 'Career Hub', color: 'hover:text-blue-400', icon: true },
    ...(user ? [{ href: '/bookmarks', label: 'Bookmarks', color: 'hover:text-rose-400' }] : []),
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative group/logo">
                <div className="absolute -inset-1.5 bg-blue-500/20 rounded-full blur-md group-hover/logo:bg-blue-500/40 transition-all duration-500" />
                <img 
                  src="/favicon.png" 
                  alt="CertiFind Logo" 
                  className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover/logo:scale-110 transition-transform duration-500" 
                />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-white/70 ${link.color} px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/5 flex items-center gap-1.5 group/nav`}
                >
                  {link.label}
                  {link.icon && <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover/nav:animate-pulse" />}
                </Link>
              ))}
            </div>

            {/* Right Side: Auth + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Auth Section */}
              {loading ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 pl-1.5 pr-2 py-1.5 rounded-full hover:border-certifind-accent/40 transition-all group/profile">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-certifind-accent/30 rounded-full blur-sm opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                    <img 
                      src={getAvatarUrl(user)}
                      alt="User Avatar" 
                      className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
                  </div>
                  
                  {/* Name — hidden on small screens */}
                  <div className="hidden sm:flex flex-col pr-1">
                    <span className="text-white text-sm font-black tracking-tight leading-none mb-0.5">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || "Scholar"}
                    </span>
                    <span className="text-certifind-accent text-[8px] uppercase font-black tracking-[0.1em]">
                      Elite Member
                    </span>
                  </div>

                  <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

                  <button 
                    onClick={handleLogout}
                    className="text-neutral-500 hover:text-rose-400 transition-all hover:bg-rose-500/10 p-1.5 sm:p-2 rounded-full"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="group relative flex items-center gap-2 bg-white text-black font-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 overflow-hidden"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="hidden xs:inline">Sign In</span>
                  <span className="xs:hidden">In</span>
                </button>
              )}

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
                suppressHydrationWarning
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-2xl">
            <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-white/70 ${link.color} px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5 flex items-center gap-2`}
                >
                  {link.label}
                  {link.icon && <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={handleLogin}
                  className="mt-2 w-full bg-white text-black font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-600" /> Sign In with Google
                </button>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
