import Link from "next/link";
import { Sparkles, Target, Users, Zap, Award, BookOpen, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Courses Indexed", value: "100+", color: "text-blue-400" },
    { label: "Platforms Covered", value: "5+", color: "text-emerald-400" },
    { label: "Departments", value: "15", color: "text-purple-400" },
    { label: "AI-Powered", value: "100%", color: "text-amber-400" },
  ];

  const values = [
    { icon: Target, title: "Curated Quality", desc: "Every course is evaluated for real-world impact — no filler, only high-signal content.", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { icon: Zap, title: "AI-Enhanced", desc: "Our Career Hub analyzes your resume gaps and maps personalized growth paths in seconds.", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { icon: Users, title: "Learner-First", desc: "Built for students, professionals, and career-switchers who demand more signal, less noise.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { icon: BookOpen, title: "Open Access", desc: "Thousands of free certified courses aggregated into one seamless discovery interface.", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Our Mission
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            Unifying the World's<br />
            <span className="text-blue-400">Best Education</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            CertiFind is an AI-powered career platform that aggregates the internet's highest-quality online courses and certifications into one seamless, curated discovery experience.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-white/5 bg-neutral-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-neutral-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 gap-8 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">The Problem We Solve</h2>
            <p className="text-neutral-400 leading-relaxed mb-4">
              The online education landscape is fragmented across Udemy, Coursera, Google, LinkedIn Learning, and dozens of other platforms. Learners waste hours hunting for the right course when they should be learning.
            </p>
            <p className="text-neutral-400 leading-relaxed">
              <strong className="text-white">CertiFind eliminates that friction.</strong> We centralize, categorize, and surface the highest-quality free and paid courses so you can go from "I want to learn X" to enrolled in minutes.
            </p>
          </div>
          <div className="bg-neutral-900 border border-white/8 rounded-2xl p-6 space-y-4">
            {["Search across 5+ platforms at once", "AI career gap analysis", "One-click resume export", "Free & paid courses in one place", "Bookmark your learning path"].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                <Award className="w-4 h-4 text-certifind-accent flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <h2 className="text-3xl font-black text-white mb-8 text-center">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {values.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`p-5 rounded-2xl border ${color.split(' ').slice(1).join(' ')}`}>
              <Icon className={`w-6 h-6 mb-3 ${color.split(' ')[0]}`} />
              <h3 className="text-white font-bold mb-1">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/analyzer" className="inline-flex items-center gap-2 bg-certifind-accent hover:bg-purple-600 text-white font-black px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(114,38,255,0.3)] hover:-translate-y-0.5">
            Try the AI Career Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
