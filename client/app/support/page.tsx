import Link from "next/link";
import { LifeBuoy, BookOpen, MessageSquare, Zap, ExternalLink, ChevronDown } from "lucide-react";

const FAQ = [
  { q: "How do I bookmark a course?", a: "Sign in with Google, then click the bookmark icon on any course card. Your saved courses appear in the Bookmarks page." },
  { q: "Is CertiFind free to use?", a: "Yes, CertiFind is completely free. We simply aggregate and link to courses on external platforms. Paid course fees are charged by the host platform, not by us." },
  { q: "How does the AI Career Hub work?", a: "Upload your resume as a PDF. Our AI extracts your skills, cross-references them against our course catalog, and recommends the highest-impact courses to fill your gaps. You can then export an AI-optimized resume PDF." },
  { q: "Why can't I see all courses?", a: "The homepage shows the top-rated courses per section. Use the department filters, search bar, or visit the dedicated Free/Paid course pages to browse the full catalog." },
  { q: "My PDF didn't upload. What should I do?", a: "Ensure your file is a standard non-encrypted PDF under 5MB. Scanned image-only PDFs may not extract text correctly. Try re-saving from Word or Google Docs as PDF." },
  { q: "How do I report a broken course link?", a: "Use the Contact page to report any broken or outdated links and we'll update them within 48 hours." },
];

export default function SupportPage() {
  const categories = [
    { icon: BookOpen, title: "Getting Started", desc: "Learn how to search, filter, and discover courses.", href: "/free-courses", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { icon: Zap, title: "Career Hub (AI)", desc: "Resume analysis, skill gaps, and PDF export.", href: "/analyzer", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { icon: MessageSquare, title: "Contact Us", desc: "Still need help? Send us a direct message.", href: "/contact", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-emerald-500/20">
          <LifeBuoy className="w-3.5 h-3.5" /> Help Center
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Support <span className="text-emerald-400">&amp; Help</span>
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
          Find answers to common questions or reach out directly. We're here to help.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {categories.map(({ icon: Icon, title, desc, href, color }) => (
          <Link key={title} href={href}
            className={`p-5 rounded-2xl border ${color.split(' ').slice(1).join(' ')} hover:scale-[1.02] transition-transform group`}>
            <Icon className={`w-6 h-6 mb-3 ${color.split(' ')[0]}`} />
            <h3 className="text-white font-bold mb-1">{title}</h3>
            <p className="text-neutral-400 text-xs leading-relaxed mb-3">{desc}</p>
            <div className={`flex items-center gap-1 text-xs font-bold ${color.split(' ')[0]}`}>
              Go <ExternalLink className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <ChevronDown className="w-6 h-6 text-neutral-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-neutral-900/60 border border-white/8 rounded-2xl p-5 sm:p-6">
              <h3 className="text-white font-bold text-sm sm:text-base mb-2">{q}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-neutral-500 text-sm mb-4">Didn't find your answer?</p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-certifind-accent hover:bg-purple-600 text-white font-black px-8 py-3.5 rounded-full transition-all text-sm shadow-[0_0_20px_rgba(114,38,255,0.25)]">
          <MessageSquare className="w-4 h-4" /> Contact the Team
        </Link>
      </div>
    </div>
  );
}
