"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : '' }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-black tracking-tighter text-white group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/5">Home</Link>
              <Link href="/free-courses" className="text-white/70 hover:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-emerald-500/10">Free Courses</Link>
              <Link href="/paid-courses" className="text-white/70 hover:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-amber-500/10">Paid Courses</Link>
              <Link href="/analyzer" className="text-white/70 hover:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-blue-500/10 flex items-center gap-1.5 group/nav">
                AI Analyzer <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover/nav:animate-pulse" />
              </Link>
              {user && (
                <Link href="/bookmarks" className="text-white/70 hover:text-rose-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-rose-500/10">Bookmarks</Link>
              )}
            </div>
          </div>

          <div className="flex items-center flex-shrink-0 gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-1.5 pr-2 py-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                <img 
                  src={user.user_metadata?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full border border-white/20 object-cover"
                />
                
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold truncate max-w-[120px]">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Student"}
                  </span>
                  <span className="text-certifind-accent text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">
                    Verified
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-rose-400 transition-colors bg-black/40 hover:bg-rose-500/10 p-2 rounded-full ml-1"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 border border-blue-400/30"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
