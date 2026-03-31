'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Loader2, User, Sparkles, Zap, Map, BookOpen, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { getSession, getRole, logout } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const sess = await getSession();
      setSession(sess);
      setRole(await getRole());
      setLoading(false);
    }
    init();
  }, [getSession, getRole]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#7226FF' }} />
      </div>
    );
  }

  const name = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Learner';
  const roleColors = {
    premium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    admin: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    student: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }[role] || 'text-white/50 bg-white/5 border-white/10';

  const stats = [
    { label: 'Courses Completed', val: '0', icon: CheckCircle, color: '#22c55e' },
    { label: 'Learning Hours', val: '0', icon: Clock, color: '#eab308' },
    { label: 'Saved Courses', val: '0', icon: Bookmark, color: '#7226FF' },
  ];

  function CheckCircle(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>; }
  function Bookmark(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>; }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* Header Profile Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-12" style={{ backgroundColor: '#010030' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden flex-shrink-0 bg-neutral-900">
            {session?.user?.user_metadata?.avatar_url ? (
              <img src={session.user.user_metadata.avatar_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-900/50">
                <User className="w-10 h-10 text-purple-400" />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white">{name}</h1>
            <p className="text-white/50">{session?.user?.email}</p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${roleColors}`}>
                {role}
              </span>
              {role === 'student' && (
                <Link href="/pricing" className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>

          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white/70 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Left Column (Actions) */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-black text-white">Quick Actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/analyzer" className="p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-purple-500/30 transition-all group">
                <Sparkles className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-white mb-1">AI Career Hub</h3>
                <p className="text-xs text-white/40">Analyze your resume and find skill gaps.</p>
              </Link>
              <Link href="/" className="p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-blue-500/30 transition-all group">
                <BookOpen className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-white mb-1">Explore Courses</h3>
                <p className="text-xs text-white/40">Discover top-tier certifications.</p>
              </Link>
              {['admin', 'premium'].includes(role) && (
                <Link href="/paid-courses" className="p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-emerald-500/30 transition-all group">
                  <Map className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white mb-1">Premium Perks</h3>
                  <p className="text-xs text-white/40">Access exclusive paid guides & paths.</p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Stats) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-xs">Your Stats</h2>
          <div className="space-y-4">
            {stats.map(({ label, val, icon: Icon, color }) => (
              <div key={label} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5" style={{ color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-white/60">{label}</span>
                </div>
                <span className="text-lg font-black text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
