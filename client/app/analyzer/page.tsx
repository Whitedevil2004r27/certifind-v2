"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, TrendingUp, Sparkles, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Analysis failed. Please ensure the file is a valid PDF.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-6 py-12 lg:py-20 relative">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-certifind-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-certifind-accent/10 text-certifind-accent px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-certifind-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Skill Analyzer
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Bridge your <span className="text-certifind-accent">Resume</span> Gap
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and our AI will cross-reference your skills with the industry's highest-tier certificates to find your perfect growth path.
          </p>
        </div>

        {!result ? (
          <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-certifind-accent to-transparent opacity-30" />
            
            <form onSubmit={handleUpload} className="space-y-10">
              <div 
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-500 cursor-pointer flex flex-col items-center gap-6 ${
                  file ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 hover:border-certifind-accent/50 hover:bg-white/5"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  file ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-500 group-hover:text-certifind-accent group-hover:scale-110"
                }`}>
                  {file ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {file ? file.name : "Select your Resume"}
                  </h3>
                  <p className="text-neutral-500 font-medium">
                    Drag and drop or click to browse. Supports PDF format (Max 5MB).
                  </p>
                </div>

                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  id="resume-upload"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                <label 
                  htmlFor="resume-upload"
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold transition-all cursor-pointer border border-white/10"
                >
                  Choose File
                </label>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl text-sm font-bold animate-shake">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-certifind-accent hover:bg-certifind-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(114,38,255,0.3)] flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Analyzing your Skills...
                  </>
                ) : (
                  <>
                    Analyze Resume <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {/* Header Result Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Competency Identified!</h3>
                  <p className="text-neutral-300 max-w-xl text-lg leading-relaxed">
                    {result.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.detectedSkills.map((skill: string) => (
                    <span key={skill} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-emerald-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <TrendingUp className="w-8 h-8 text-certifind-accent" />
                <h2 className="text-3xl font-black text-white tracking-tight">Your Action Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {result.recommendations.map((rec: any, idx: number) => (
                  <div 
                    key={rec.course_id}
                    className="bg-neutral-900/60 border border-white/5 rounded-3xl overflow-hidden hover:border-certifind-accent/50 transition-all duration-500 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-certifind-accent/10 text-certifind-accent text-[10px] font-black px-2.5 py-1 rounded-full border border-certifind-accent/20 uppercase tracking-widest">
                          Priority {idx + 1}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          +{rec.newSkillsCount} new skills
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-6 min-h-[56px] line-clamp-2">
                        {rec.title}
                      </h4>
                      <Link 
                        href={`/courses/${rec.course_id}`}
                        className="w-full bg-white/5 hover:bg-certifind-accent text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        Start Learning <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={() => { setResult(null); setFile(null); }}
                className="text-neutral-500 hover:text-white font-bold transition-colors flex items-center gap-2 mx-auto"
              >
                 Upload another version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
