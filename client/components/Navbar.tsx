"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-black tracking-tighter text-white group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="text-neutral-400 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/5">Home</Link>
              <Link href="/free" className="text-neutral-400 hover:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-emerald-500/10">Free Courses</Link>
              <Link href="/paid" className="text-neutral-400 hover:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-amber-500/10">Paid Courses</Link>
              {user && (
                <Link href="/bookmarks" className="text-neutral-400 hover:text-rose-400 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-rose-500/10">Bookmarks</Link>
              )}
            </div>
          </div>

          <div className="flex items-center flex-shrink-0 gap-4">
            {user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 pl-1.5 pr-1.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                <img 
                  src={user.user_metadata?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  title={user.email}
                />
                <button 
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-rose-400 transition-colors bg-black/40 hover:bg-rose-500/10 p-2 rounded-full"
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
