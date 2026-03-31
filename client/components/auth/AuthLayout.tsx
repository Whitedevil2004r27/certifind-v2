import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#010030' }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-purple-900/30">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#7226FF 1px, transparent 1px), linear-gradient(90deg, #7226FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/favicon.png" alt="CertiFind" className="w-10 h-10 rounded-full border border-purple-500/30" />
            <span className="text-2xl font-black text-white tracking-tighter">
              Certi<span style={{ color: '#7226FF' }}>Find</span>
            </span>
          </Link>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Hub
          </div>
          <h1 className="text-4xl font-black text-white leading-tight">
            Discover. Learn.<br />
            <span style={{ color: '#7226FF' }}>Advance.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xs">
            Join thousands of learners accessing the world's best courses and certifications in one place.
          </p>
          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[['100+', 'Courses'], ['15', 'Departments'], ['100%', 'Free to join']].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-black" style={{ color: '#7226FF' }}>{n}</div>
                <div className="text-white/40 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-white/30 text-xs">
          © {new Date().getFullYear()} CertiFind. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="CertiFind" className="w-8 h-8 rounded-full" />
              <span className="text-xl font-black text-white">Certi<span style={{ color: '#7226FF' }}>Find</span></span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
