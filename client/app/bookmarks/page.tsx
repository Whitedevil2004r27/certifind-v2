"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CourseCard, { Course } from "@/components/CourseCard";
import { BookMarked } from "lucide-react";

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }
      
      setUser(session.user);

      // Fetch bookmark rows and join the related courses table rows
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          course_id,
          courses (*)
        `)
        .eq('user_id', session.user.id);
        
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data) {
        // Map the results to just the course array
        const bookmarkedCourses = data.map((b: any) => b.courses).filter(Boolean);
        setCourses(bookmarkedCourses);
      }
      
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Your Bookmarks</h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Please sign in via the Navbar to view and manage your saved courses.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight flex items-center gap-4">
          <BookMarked className="w-10 h-10 text-rose-500" />
          Saved Courses
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl">
          Your personal library of favorites.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {courses.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-900/40 rounded-[3rem] border border-white/5 backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white mb-3">No bookmarks yet</h3>
          <p className="text-neutral-400 max-w-md mx-auto">
            Explore the catalog and click the heart icon on any course to save it here for later!
          </p>
        </div>
      )}
    </div>
  );
}
