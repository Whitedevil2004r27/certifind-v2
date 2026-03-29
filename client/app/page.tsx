"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { Search, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All", "Web Dev", "Data Science", "Mobile Dev", "Cloud", "Business", "Design", "Finance", "Game Dev", "DevOps"];

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCourses = useCallback(async (pageNum: number, currentSearch: string, currentCategory: string, append: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `http://localhost:5000/api/courses?page=${pageNum}&limit=9`;
      if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
      if (currentCategory !== "All") url += `&category=${encodeURIComponent(currentCategory)}`;

      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok && data.courses) {
        if (append) {
          setCourses(prev => [...prev, ...data.courses]);
        } else {
          setCourses(data.courses);
        }
        
        // Check if we reached the end of the total count
        setHasMore(pageNum < data.pagination.totalPages);
      } else {
        if (!append) setCourses([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Effect for handling Search or Category changes (resets to page 1)
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchCourses(1, search, category, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, fetchCourses]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCourses(nextPage, search, category, true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden flex flex-col items-center justify-center border-b border-neutral-800 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-black pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-sm">
            Certi<span className="text-blue-500">Find</span> Platform
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the internet's greatest courses from top platforms. Navigate top-tier free gems, or invest in premium tracks designed to elevate your career.
          </p>
          
          <div className="relative max-w-xl mx-auto mb-10 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search by keyword, topic, or platform..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-neutral-600 shadow-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free" className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 px-8 py-3.5 rounded-full font-bold transition-colors shadow-lg shadow-green-500/10">
              Explore Free Courses
            </Link>
            <Link href="/paid" className="w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 px-8 py-3.5 rounded-full font-bold transition-colors shadow-lg shadow-amber-500/10">
              Explore Paid Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-white/5 gap-6">
          <h2 className="text-4xl font-black text-white tracking-tight flex-shrink-0">Course Catalog<span className="text-blue-500">.</span></h2>
          
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 justify-end">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  category === cat 
                    ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                    : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <div key={course.id + idx} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 9) * 100}ms` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group hover:border-blue-500/50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  ) : (
                    <>
                      Load More <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform text-blue-400" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30 backdrop-blur-sm">
            <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
            <p className="text-neutral-500 font-medium">Try adjusting your search or selecting a different category.</p>
            <button 
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
