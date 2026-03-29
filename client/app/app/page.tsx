import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";

export default function GetAppPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6 border border-neutral-700 shadow-2xl">
        <Smartphone className="w-10 h-10 text-white animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Get the Mobile App
      </h1>
      <p className="text-lg text-neutral-400 max-w-lg mb-8 leading-relaxed">
        Our native iOS and Android applications are currently in closed beta. Check back soon for the public beta release.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-all hover:-translate-y-1">
        <ArrowLeft className="w-4 h-4" /> Return Home
      </Link>
    </div>
  );
}
