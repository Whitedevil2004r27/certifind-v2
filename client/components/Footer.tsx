import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto relative bg-neutral-950 pt-12 pb-8 overflow-hidden border-t border-white/5">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-10">
          
          {/* Branding + tagline */}
          <div className="sm:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img src="/favicon.png" alt="CertiFind" className="w-7 h-7 rounded-full" />
              <span className="text-2xl font-black tracking-tighter text-white">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A unified discovery hub for the world's best online courses and certifications — curated, categorized, and AI-enhanced.
            </p>
            <div className="flex items-center gap-1.5 text-certifind-accent text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> AI-Powered Career Hub
            </div>
          </div>

          {/* CertiFind links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-1">Platform</h4>
            <Link href="/" className="text-neutral-400 hover:text-white transition-colors text-sm">Home</Link>
            <Link href="/free-courses" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">Free Courses</Link>
            <Link href="/paid-courses" className="text-neutral-400 hover:text-amber-400 transition-colors text-sm">Paid Courses</Link>
            <Link href="/analyzer" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm">Career Hub</Link>
            <Link href="/bookmarks" className="text-neutral-400 hover:text-rose-400 transition-colors text-sm">Bookmarks</Link>
          </div>

          {/* Company links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-1">Company</h4>
            <Link href="/about" className="text-neutral-400 hover:text-white transition-colors text-sm">About</Link>
            <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors text-sm">Contact</Link>
            <Link href="/support" className="text-neutral-400 hover:text-white transition-colors text-sm">Support</Link>
            <Link href="/admin" className="text-neutral-400 hover:text-white transition-colors text-sm">Admin</Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} CertiFind. Open Source Education.
          </p>
          <p className="text-white/40 text-xs">
            Powered by{" "}
            <span className="font-black text-white/60 tracking-widest bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
              RAVIKUMAR
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}
