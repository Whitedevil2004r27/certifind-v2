"use client";

import { useEffect, useState, useCallback } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { Search, Loader2, Award, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";

const DEPARTMENTS = [
  { label: "All", value: "All" },
  { label: "💻 Computer Science", value: "Computer Science Engineering" },
  { label: "🌐 Web Development", value: "Web Development" },
  { label: "📊 Data Science", value: "Data Science Engineering" },
  { label: "🤖 AI & Machine Learning", value: "AI & Machine Learning" },
  { label: "☁️ Cloud & AWS", value: "AWS" },
  { label: "🛡️ Ethical Hacking", value: "Ethical Hacking" },
  { label: "📱 Mobile Development", value: "Mobile Development" },
  { label: "🎨 UI/UX Design", value: "UI/UX Design" },
  { label: "🔗 DevOps", value: "DevOps" },
  { label: "🧮 Information Technology", value: "Information Technology" },
  { label: "🌱 Agricultural Technology", value: "Agricultural Technology" },
  { label: "💊 Clinical Research", value: "Clinical Research" },
  { label: "📈 Business & Management", value: "Business & Management" },
  { label: "🔐 Cybersecurity", value: "Cybersecurity" },
];

const INITIAL_LIMIT = 12;
const LOAD_MORE_LIMIT = 12;

export default function HomePage() {
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [paidCourses, setPaidCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [freeLimit, setFreeLimit] = useState(INITIAL_LIMIT);
  const [paidLimit, setPaidLimit] = useState(INITIAL_LIMIT);
  const [totalFree, setTotalFree] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loadingMore, setLoadingMore] = useState<"free" | "paid" | null>(null);

  const fetchCourses = useCallback(async (
    currentSearch: string,
    currentCategory: string,
    fLimit: number,
    pLimit: number,
    isLoadMore = false
  ) => {
    if (!isLoadMore) setLoading(true);

    try {
      let baseUrl = `/api/courses?`;
      if (currentSearch) baseUrl += `search=${encodeURIComponent(currentSearch)}&`;
      if (currentCategory !== "All") baseUrl += `department=${encodeURIComponent(currentCategory)}&`;

      const [freeRes, paidRes] = await Promise.all([
        fetch(`${baseUrl}limit=${fLimit}&course_type=Free`),
        fetch(`${baseUrl}limit=${pLimit}&course_type=Paid`),
      ]);

      const [freeData, paidData] = await Promise.all([freeRes.json(), paidRes.json()]);

      setFreeCourses(freeData.courses || []);
      setPaidCourses(paidData.courses || []);
      setTotalFree(freeData.pagination?.total || 0);
      setTotalPaid(paidData.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(null);
    }
  }, []);

  // Debounced fetch on search/category change — reset limits
  useEffect(() => {
    setFreeLimit(INITIAL_LIMIT);
    setPaidLimit(INITIAL_LIMIT);
    const timer = setTimeout(() => {
      fetchCourses(search, category, INITIAL_LIMIT, INITIAL_LIMIT);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, fetchCourses]);

  const handleLoadMore = (type: "free" | "paid") => {
    setLoadingMore(type);
    if (type === "free") {
      const newLimit = freeLimit + LOAD_MORE_LIMIT;
      setFreeLimit(newLimit);
      fetchCourses(search, category, newLimit, paidLimit, true);
    } else {
      const newLimit = paidLimit + LOAD_MORE_LIMIT;
      setPaidLimit(newLimit);
      fetchCourses(search, category, freeLimit, newLimit, true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden flex flex-col items-center justify-center border-b border-neutral-800 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-black pointer-events-none" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6 drop-shadow-sm">
            Certi<span className="text-certifind-accent">Find</span> Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the internet's greatest courses from top platforms. Navigate top-tier free gems, or invest in premium tracks designed to elevate your career.
          </p>

          <div className="relative max-w-xl mx-auto mb-8 sm:mb-10 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-certifind-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by keyword, topic, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-certifind-accent/50 focus:border-certifind-accent transition-all font-medium placeholder:text-neutral-600 shadow-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/free-courses" className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 px-8 py-3.5 rounded-full font-bold transition-colors">
              Explore Free Courses
            </Link>
            <Link href="/paid-courses" className="w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 px-8 py-3.5 rounded-full font-bold transition-colors">
              Explore Premium Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* Main Discover Frame */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Department Filters — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 sm:flex-wrap sm:justify-center scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {DEPARTMENTS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                category === value
                  ? "bg-certifind-accent text-white border-certifind-accent/50 shadow-[0_0_12px_rgba(114,38,255,0.4)]"
                  : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 text-certifind-accent animate-spin" />
          </div>
        ) : (freeCourses.length === 0 && paidCourses.length === 0) ? (
          <div className="text-center py-24 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30">
            <Search className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No matching courses found</h2>
            <p className="text-neutral-500 font-medium text-sm">Try a different keyword or department.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-5 px-6 py-2 bg-certifind-accent hover:bg-purple-600 text-white rounded-full font-semibold transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-20">

            {/* FREE COURSES */}
            {freeCourses.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-emerald-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2 sm:gap-3">
                      <Zap className="text-emerald-500 w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                      Open Source <span className="text-emerald-500">Tier</span>
                      <span className="text-sm font-normal text-neutral-500 ml-1">({totalFree} courses)</span>
                    </h2>
                    <p className="text-neutral-500 mt-1 text-sm">High-quality educational streams available at no cost.</p>
                  </div>
                  <Link href="/free-courses" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest text-xs self-start sm:self-auto flex-shrink-0">
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {freeCourses.map((course, idx) => (
                    <div key={course.course_id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 12) * 60}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>

                {freeCourses.length < totalFree && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => handleLoadMore("free")}
                      disabled={loadingMore === "free"}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 px-8 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {loadingMore === "free"
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                        : <><ChevronDown className="w-4 h-4" /> Load More Free Courses ({totalFree - freeCourses.length} remaining)</>
                      }
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PAID COURSES */}
            {paidCourses.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-amber-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2 sm:gap-3">
                      <Award className="text-amber-500 w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                      Enterprise <span className="text-amber-500">Curriculum</span>
                      <span className="text-sm font-normal text-neutral-500 ml-1">({totalPaid} courses)</span>
                    </h2>
                    <p className="text-neutral-500 mt-1 text-sm">Intensive professional-grade certifications and bootcamps.</p>
                  </div>
                  <Link href="/paid-courses" className="text-amber-500 font-bold hover:text-amber-400 transition-colors uppercase tracking-widest text-xs self-start sm:self-auto flex-shrink-0">
                    Explore All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paidCourses.map((course, idx) => (
                    <div key={course.course_id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 12) * 60}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>

                {paidCourses.length < totalPaid && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => handleLoadMore("paid")}
                      disabled={loadingMore === "paid"}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 px-8 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {loadingMore === "paid"
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                        : <><ChevronDown className="w-4 h-4" /> Load More Premium Courses ({totalPaid - paidCourses.length} remaining)</>
                      }
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  );
}
