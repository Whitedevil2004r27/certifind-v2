"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getAvatarUrl = (user: any) => {
    // Robust fallback chain for Google OAuth avatar
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
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative group/logo">
                <div className="absolute -inset-1.5 bg-blue-500/20 rounded-full blur-md group-hover/logo:bg-blue-500/40 transition-all duration-500" />
                <img 
                  src="/favicon.png" 
                  alt="CertiFind Logo" 
                  className="relative w-10 h-10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover/logo:scale-110 transition-transform duration-500" 
                />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/5">Home</Link>
              <Link href="/free-courses" className="text-white/70 hover:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-emerald-500/10">Free Courses</Link>
              <Link href="/paid-courses" className="text-white/70 hover:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-amber-500/10">Paid Courses</Link>
              <Link href="/analyzer" className="text-white/70 hover:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-blue-500/10 flex items-center gap-1.5 group/nav">
                Career Hub <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover/nav:animate-pulse" />
              </Link>
              {user && (
                <Link href="/bookmarks" className="text-white/70 hover:text-rose-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-rose-500/10">Bookmarks</Link>
              )}
            </div>
          </div>

          <div className="flex items-center flex-shrink-0 gap-4">
            {/* Mobile AI Analyzer Shortcut */}
            <Link 
              href="/analyzer" 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 group"
              title="AI Analyzer"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Auth Section: hidden while session is resolving to prevent flash */}
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-1.5 pr-2 py-1.5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:border-certifind-accent/40 transition-all group/profile">
                <div className="relative">
                  <div className="absolute -inset-1 bg-certifind-accent/30 rounded-full blur-sm opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                  <img 
                    src={getAvatarUrl(user)}
                    alt="User Avatar" 
                    className="relative w-10 h-10 rounded-full border-2 border-white/10 group-hover/profile:border-certifind-accent/50 transition-colors object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
                </div>
                
                <div className="flex flex-col pr-1">
                  <span className="text-white text-sm font-black tracking-tight leading-none mb-1">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Scholar"}
                  </span>
                  <span className="text-certifind-accent text-[8px] uppercase font-black tracking-[0.1em]">
                    Elite Member
                  </span>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button 
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-rose-400 transition-all hover:bg-rose-500/10 p-2 rounded-full"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="group relative flex items-center gap-2 bg-white text-black font-black px-8 py-3 rounded-full transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <User className="w-4 h-4 text-blue-600" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
