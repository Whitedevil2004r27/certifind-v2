"use client";

import { useEffect, useState } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = search ? `http://localhost:5000/api/courses?search=${search}` : `http://localhost:5000/api/courses`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCourses(data.slice(0, 6)); // Featured courses limit
        } else {
          console.error("Failed to load courses:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-neutral-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free" className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 px-8 py-3.5 rounded-full font-bold transition-colors">
              Explore Free Courses
            </Link>
            <Link href="/paid" className="w-full sm:w-auto bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-8 py-3.5 rounded-full font-bold transition-colors">
              Explore Paid Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Featured Paths<span className="text-blue-500">.</span></h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
            <p className="text-neutral-500 font-medium">No courses found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
