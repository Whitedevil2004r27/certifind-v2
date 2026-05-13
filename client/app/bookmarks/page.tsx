"use client";

import { useEffect, useState } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { BookMarked, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/bookmarks');
        if (res.status === 401) {
          setUnauthorized(true);
          return;
        }

        const data = await res.json();
        if (res.ok && data && !data.error) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-certifind-accent animate-spin" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-4 gap-6">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
          <BookMarked className="w-10 h-10 text-rose-400" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Your Bookmarks</h1>
          <p className="text-neutral-400 max-w-sm mx-auto mb-6">
            Sign in to view and manage your saved courses across all sessions.
          </p>
          <Link
            href="/login?callbackUrl=/bookmarks"
            className="inline-flex items-center gap-2 bg-white text-black font-black px-8 py-3.5 rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4 text-blue-600" /> Sign in
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen py-12 sm:py-16 max-w-[1400px] mx-auto px-4 sm:px-6 relative">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-rose-500/20 pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 flex items-center gap-3">
            <BookMarked className="w-7 h-7 sm:w-10 sm:h-10 text-rose-500" /> Saved Courses
          </h1>
          <p className="text-neutral-500 text-sm">
            {courses.length > 0 ? `${courses.length} course${courses.length > 1 ? 's' : ''} saved` : 'Your personal learning library'}
          </p>
        </div>
        <Link href="/" className="text-rose-400 font-bold hover:text-rose-300 transition-colors uppercase tracking-widest text-xs self-start sm:self-auto flex-shrink-0">
          Browse Courses
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
          {courses.map((course) => (
            <CourseCard 
              key={course.course_id} 
              course={course} 
              onBookmarkToggle={(id, bookmarked) => {
                if (!bookmarked) {
                  setCourses(prev => prev.filter(c => c.course_id !== id));
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
          <BookMarked className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No bookmarks yet</h3>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-6">
            Click the bookmark icon on any course card to save it here for later.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-certifind-accent hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}
