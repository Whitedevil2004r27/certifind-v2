import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.2)] rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-amber-500 rounded-full animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Affiliate Team
      </h1>
      <p className="text-lg text-neutral-400 max-w-lg mb-8 leading-relaxed">
        Our partner program is being actively developed. Soon you will be able to earn revenue sharing for curating public bookmarks!
      </p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-all hover:-translate-y-1">
        <ArrowLeft className="w-4 h-4" /> Return Home
      </Link>
    </div>
  );
}
