"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, TrendingUp, Sparkles, Loader2, ArrowRight, Download, Eye, X, Edit3 } from "lucide-react";
import Link from "next/link";
import ResumeTemplate from "@/components/ResumeTemplate";
import { generateResumePDF } from "@/lib/pdf-generator";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Mock Resume Data for the Generator (In a real app, this would be partially parsed from the PDF)
  const [resumeData, setResumeData] = useState({
    fullName: "Career Scholar",
    email: "scholar@certifind.ai",
    phone: "+1 (555) CERT-AI",
    location: "Global Digital Hub",
    skills: ["AI Strategy", "Full-Stack Development", "Technical Architecture"],
    experience: [
      {
        company: "CertiFind AI Labs",
        role: "Senior Skill Architect",
        period: "2023 - Present",
        description: ["Designing automated career roadmap algorithms", "Implementing serverless PDF parsing engines"]
      }
    ],
    education: [
      {
        school: "CertiFind Academy",
        degree: "Master of Continuous Learning",
        year: "2024"
      }
    ]
  });

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
      
      // Update Resume Data with detected skills
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, ...data.detectedSkills].slice(0, 12)
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    const success = await generateResumePDF("resume-content", `${resumeData.fullName}_CertiFind_Resume.pdf`);
    setExporting(false);
    if (success) {
      // Optional: Show success toast
    }
  };

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-4 sm:px-6 py-10 lg:py-20 relative">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-certifind-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-certifind-accent/10 text-certifind-accent px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-certifind-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Hub
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            {result ? "Your Growth Strategy" : "Elite Resume Analyzer"}
          </h1>
          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {result 
              ? "We've mapped your competencies and built an upgraded resume template for you." 
              : "Upload your resume to identify skill gaps and instantly generate an ATS-optimized AI resume."
            }
          </p>
        </div>

        {!result ? (
          <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-3xl rounded-[2rem] p-5 sm:p-8 md:p-16 shadow-2xl relative overflow-hidden group">
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
                
                <input 
                  type="file" accept=".pdf" className="hidden" id="resume-upload"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <h3 className="text-2xl font-bold text-white mb-2">{file ? file.name : "Select your Resume"}</h3>
                  <p className="text-neutral-500 font-medium">Drag and drop or click to browse. Supports PDF (Max 5MB).</p>
                </label>
              </div>

              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl text-sm font-bold">❌ {error}</div>}

              <button
                type="submit" disabled={!file || loading}
                className="w-full bg-certifind-accent hover:bg-certifind-accent/80 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(114,38,255,0.3)] flex items-center justify-center gap-3 text-lg"
              >
                {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</> : <>Start Discovery <ArrowRight className="w-6 h-6" /></>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in relative">
            {/* Quick Actions Tray - stacks vertically on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
              <button 
                onClick={() => setShowPreview(true)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-white/10 group"
              >
                <Eye className="w-5 h-5 text-certifind-accent group-hover:scale-110" /> Preview AI Resume
              </button>
              <button 
                onClick={handleExport}
                disabled={exporting}
                className="w-full sm:w-auto bg-certifind-accent hover:bg-certifind-accent/80 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 
                One-Click Export
              </button>
            </div>

            {/* Resume Preview Modal - Properly scrollable on mobile */}
            {showPreview && (
              <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 md:p-10">
                <div className="relative max-w-4xl w-full mx-auto">
                  <div className="flex justify-end mb-3">
                    <button 
                      onClick={() => setShowPreview(false)}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-black text-sm hover:bg-gray-200 transition-colors shadow-2xl"
                    >
                      <X className="w-4 h-4" /> Close
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <ResumeTemplate data={resumeData} />
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Profile Updated!</h3>
                  <p className="text-neutral-300 max-w-xl text-lg leading-relaxed">{result.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.detectedSkills.map((skill: string) => (
                    <span key={skill} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-emerald-500/30 font-black">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Recommendations */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <TrendingUp className="w-8 h-8 text-certifind-accent" />
                <h2 className="text-3xl font-black text-white tracking-tight">Recommended Tracks</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {result.recommendations.map((rec: any, idx: number) => (
                  <div key={rec.course_id} className="bg-neutral-900/60 border border-white/5 rounded-3xl overflow-hidden hover:border-certifind-accent/50 transition-all duration-500 group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-certifind-accent/10 text-certifind-accent text-[10px] font-black px-2.5 py-1 rounded-full border border-certifind-accent/20 uppercase tracking-widest">P{idx + 1}</span>
                        <div className="text-emerald-400 text-xs font-black">+{rec.newSkillsCount} new skills</div>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-6 min-h-[56px] line-clamp-2">{rec.title}</h4>
                      <Link href={`/courses/${rec.course_id}`} className="w-full bg-white/5 hover:bg-certifind-accent text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                        Enroll <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
                 Analysis History
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden container for PDF generation */}
      <div className="hidden">
        <ResumeTemplate data={resumeData} />
      </div>
    </div>
  );
}
