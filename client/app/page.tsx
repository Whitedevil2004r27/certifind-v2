"use client";

import { useEffect, useState, useCallback } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { Search, Loader2, Award, Zap } from "lucide-react";
import Link from "next/link";

const DEPARTMENTS = ["All", "Computer Science Engineering", "Information Technology", "Web Development", "Data Science Engineering", "AWS", "Ethical Hacking", "Agricultural Technology", "Clinical Research"];

export default function HomePage() {
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [paidCourses, setPaidCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async (currentSearch: string, currentCategory: string) => {
    setLoading(true);
    try {
      let baseUrl = `/api/courses?limit=6`;
      if (currentSearch) baseUrl += `&search=${encodeURIComponent(currentSearch)}`;
      if (currentCategory !== "All") baseUrl += `&department=${encodeURIComponent(currentCategory)}`;

      const [freeRes, paidRes] = await Promise.all([
        fetch(`${baseUrl}&course_type=Free`),
        fetch(`${baseUrl}&course_type=Paid`)
      ]);

      const [freeData, paidData] = await Promise.all([freeRes.json(), paidRes.json()]);
      
      setFreeCourses(freeData.courses || []);
      setPaidCourses(paidData.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for handling Search or Category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(search, category);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, fetchCourses]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden flex flex-col items-center justify-center border-b border-neutral-800 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-black pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-sm">
            Certi<span className="text-certifind-accent">Find</span> Platform
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the internet's greatest courses from top platforms. Navigate top-tier free gems, or invest in premium tracks designed to elevate your career.
          </p>
          
          <div className="relative max-w-xl mx-auto mb-10 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-certifind-accent transition-colors" />
            <input 
              type="text"
              placeholder="Search by keyword, topic, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-certifind-accent/50 focus:border-certifind-accent transition-all font-medium placeholder:text-neutral-600 shadow-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free-courses" className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 px-8 py-3.5 rounded-full font-bold transition-colors shadow-lg shadow-green-500/10">
              Explore Free Courses
            </Link>
            <Link href="/paid-courses" className="w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 px-8 py-3.5 rounded-full font-bold transition-colors shadow-lg shadow-amber-500/10">
              Explore Premium Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* Main Discover Frame */}
      <section className="py-20 max-w-[1400px] mx-auto px-6">
        
        {/* Dynamic Schema Filters (Now routed properly to 'department') */}
        <div className="flex flex-wrap gap-2 justify-center mb-16">
          {DEPARTMENTS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                category === cat 
                  ? "bg-certifind-accent text-white border-certifind-accent/50 shadow-[0_0_15px_rgba(114,38,255,0.4)]" 
                  : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-certifind-accent animate-spin" />
          </div>
        ) : (freeCourses.length === 0 && paidCourses.length === 0) ? (
          <div className="text-center py-32 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30 backdrop-blur-sm">
            <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No matching curriculum</h2>
            <p className="text-neutral-500 font-medium">Try adjusting your search query or selecting a different faculty department.</p>
            <button 
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-6 px-6 py-2 bg-certifind-accent hover:bg-purple-600 text-white rounded-full font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* STRICTLY FREE SECTION */}
            {freeCourses.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-emerald-500/20 pb-4">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <Zap className="text-emerald-500 w-8 h-8" /> Open Source <span className="text-emerald-500">Tier</span>
                    </h2>
                    <p className="text-neutral-500 mt-1">High-quality educational streams strictly available at no cost.</p>
                  </div>
                  <Link href="/free-courses" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest text-xs hidden sm:block">View All Free &rarr;</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {freeCourses.map((course, idx) => (
                    <div key={course.course_id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 9) * 100}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STRICTLY PAID SECTION */}
            {paidCourses.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-amber-500/20 pb-4">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <Award className="text-amber-500 w-8 h-8" /> Enterprise <span className="text-amber-500">Curriculum</span>
                    </h2>
                    <p className="text-neutral-500 mt-1">Intensive professional-grade certifications and bootcamps.</p>
                  </div>
                  <Link href="/paid-courses" className="text-amber-500 font-bold hover:text-amber-400 transition-colors uppercase tracking-widest text-xs hidden sm:block">Explore Premium &rarr;</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paidCourses.map((course, idx) => (
                    <div key={course.course_id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 9) * 100}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  );
}
