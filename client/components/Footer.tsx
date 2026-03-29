import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto relative bg-neutral-950 pt-20 pb-12 overflow-hidden border-t border-white/5">
      {/* Decorative glassmorphic background sweeps */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* LEFT SIDE: Branding and Purpose */}
          <div className="lg:col-span-6 space-y-8 flex flex-col items-start pr-0 lg:pr-8">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-500 mb-2">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                Certi<span className="text-blue-500">Find</span>
              </span>
            </Link>
            
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-bold text-white tracking-wide">
                Empowering professional growth through unified discovery.
              </h3>
              <p className="text-white/70 text-base leading-relaxed">
                The noise of online education has never been louder. With thousands of platforms offering disparate curricula, learners frequently struggle to identify reputable, high-impact certifications. 
                <strong className="text-white/80"> The primary purpose of CertiFind </strong> is to eliminate this friction by acting as a highly curated, centralized aggregation hub. We meticulously organize and categorize the digital world's finest educational tracks into a single, seamless interface.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Whether you are an aspiring developer seeking foundational web frameworks, a business professional hunting for premier leadership courses, or a creative building out your design portfolio, CertiFind is built specifically to accelerate your career. By prioritizing quality over quantity, we ensure that every course indexed on our platform meets the highest standards of professional rigor.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Links separated by a left border (the cross line) */}
          <div className="lg:col-span-6 lg:border-l lg:border-white/10 lg:pl-16 pt-8 lg:pt-0 grid grid-cols-2 gap-8 border-t border-white/10 lg:border-t-0">
            
            {/* Link Column 1 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-4">CertiFind</h4>
              <Link href="/about" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm font-medium">About us</Link>
              <Link href="/careers" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm font-medium">Careers</Link>
              <Link href="/contact" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm font-medium">Contact us</Link>
              <Link href="/blog" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm font-medium">Blog</Link>
              <Link href="/investors" className="text-neutral-400 hover:text-blue-400 transition-colors text-sm font-medium">Investors</Link>
            </div>

            {/* Link Column 2 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-4">Discover & Support</h4>
              <Link href="/discover" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm font-medium">Discover Certfind</Link>
              <Link href="/app" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm font-medium">Get the app</Link>
              <Link href="/teach" className="text-neutral-400 hover:text-amber-400 transition-colors text-sm font-medium">Teach on certfind</Link>
              <Link href="/affiliate" className="text-neutral-400 hover:text-amber-400 transition-colors text-sm font-medium">Affiliate</Link>
              <Link href="/support" className="text-neutral-400 hover:text-amber-400 transition-colors text-sm font-medium">Help and Support</Link>
            </div>

          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
          <div className="flex gap-6 items-center flex-wrap">
            <Link href="/free-courses" className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Free Tier
            </Link>
            <Link href="/paid-courses" className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Premium
            </Link>
            <Link href="/bookmarks" className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Bookmarks
            </Link>
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </Link>
          </div>
 
          <div className="md:text-right flex flex-col items-start md:items-end gap-1">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} CertiFind. Open Source Education.
            </p>
            <div className="flex text-white/50 text-sm gap-2">
              <span>Powered by</span>
              <span className="font-black text-white tracking-widest bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">RAVIKUMAR</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
