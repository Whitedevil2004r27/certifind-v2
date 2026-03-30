"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "Coursera",
    category: "Web Dev",
    is_free: "true",
    price: "",
    thumbnail: "",
    course_url: ""
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const payload = {
        ...formData,
        is_free: formData.is_free === "true",
        price: formData.is_free === "true" ? null : formData.price,
      };

      const { error } = await supabase.from('courses').insert(payload);

      if (error) throw error;

      setStatus({ type: 'success', message: "Course successfully added to the catalog!" });
      setFormData({
        title: "",
        description: "",
        platform: "Coursera",
        category: "Web Dev",
        is_free: "true",
        price: "",
        thumbnail: "",
        course_url: ""
      });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || "Failed to add course." });
    } finally {
      setSubmitting(false);
      // Auto-hide success message
      setTimeout(() => setStatus({ type: null, message: "" }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Security Check: Lock out non-admins
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!adminEmail) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-4 gap-4">
        <ShieldCheck className="w-16 h-16 text-amber-400 mb-2" />
        <h1 className="text-3xl font-black text-white">Admin Not Configured</h1>
        <p className="text-neutral-400 max-w-md text-base">
          Add the following to your <code className="bg-black border border-white/10 px-2 py-0.5 rounded text-sm text-blue-400">.env.local</code> file (and in Vercel environment variables):
        </p>
        <div className="bg-neutral-900 border border-white/10 rounded-xl px-6 py-4 text-left font-mono text-sm text-emerald-400 w-full max-w-md">
          NEXT_PUBLIC_ADMIN_EMAIL=<span className="text-white">{user?.email ?? 'your-admin@gmail.com'}</span>
        </div>
        <p className="text-neutral-500 text-sm">
          {user ? <>Your current signed-in email is <strong className="text-white">{user.email}</strong></> : 'Sign in first, then add your email above.'}
        </p>
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-4 gap-4">
        <ShieldCheck className="w-16 h-16 text-rose-500 mb-2" />
        <h1 className="text-3xl font-black text-white">Access Denied</h1>
        <p className="text-neutral-400 max-w-md text-base">
          This panel is restricted to the site administrator.
          {user && <> You are signed in as <strong className="text-white">{user.email}</strong>, which is not the admin account.</>}
          {!user && <> Please sign in with the admin Google account.</>}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <ShieldCheck className="w-10 h-10 text-blue-500" />
          Admin Dashboard
        </h1>
        <p className="text-xl text-neutral-400">
          Manually add premium or obscure courses directly to the Supabase database.
        </p>
      </div>

      {status.type && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-semibold">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Course Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Advanced System Design" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Course URL</label>
            <input required type="url" name="course_url" value={formData.course_url} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
              {["Coursera", "Udemy", "edX", "Pluralsight", "Udacity", "YouTube", "Other"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
              {["Web Dev", "Data Science", "Mobile Dev", "Cloud", "Business", "Design", "Finance", "Game Dev", "DevOps"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Pricing Tier</label>
            <select name="is_free" value={formData.is_free} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
              <option value="true">Free Course</option>
              <option value="false">Paid Course</option>
            </select>
          </div>

          {formData.is_free === "false" && (
            <div className="space-y-2 animate-fade-in-up">
              <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Price (Optional)</label>
              <input name="price" value={formData.price} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. $19.99" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">Thumbnail URL <span className="text-xs text-neutral-500 font-normal capitalize">(Leave blank for random Unsplash image)</span></label>
          <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://images.unsplash.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Write a compelling course summary..."></textarea>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publish Course to Catalog"}
        </button>

      </form>
    </div>
  );
}
