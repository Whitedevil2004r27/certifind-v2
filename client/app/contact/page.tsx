"use client";
import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate submission
    setSubmitted(true);
    setLoading(false);
  };

  const info = [
    { icon: Mail, label: "Email", value: "hello@certifind.ai", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { icon: MessageSquare, label: "Response Time", value: "Within 24 hours", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { icon: MapPin, label: "Base", value: "Global — Remote First", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-certifind-accent/10 text-certifind-accent px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-certifind-accent/20">
          <Mail className="w-3.5 h-3.5" /> Get in Touch
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Contact <span className="text-certifind-accent">Us</span>
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
          Have a question, partnership idea, or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {info.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`p-5 rounded-2xl border ${color.split(' ').slice(1).join(' ')} flex items-center gap-4`}>
            <Icon className={`w-6 h-6 flex-shrink-0 ${color.split(' ')[0]}`} />
            <div>
              <div className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{label}</div>
              <div className="text-white font-bold text-sm">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-neutral-900/60 border border-white/8 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Message Sent!</h2>
            <p className="text-neutral-400">We'll get back to you within 24 hours.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
              className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold text-sm transition-all">
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Name</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full bg-neutral-800 border border-white/10 focus:border-certifind-accent text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-600" />
              </div>
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-neutral-800 border border-white/10 focus:border-certifind-accent text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Subject</label>
              <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                placeholder="What's this about?"
                className="w-full bg-neutral-800 border border-white/10 focus:border-certifind-accent text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-600" />
            </div>
            <div>
              <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Message</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write your message here..."
                className="w-full bg-neutral-800 border border-white/10 focus:border-certifind-accent text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-600 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-certifind-accent hover:bg-purple-600 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(114,38,255,0.3)] flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> Send Message</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
