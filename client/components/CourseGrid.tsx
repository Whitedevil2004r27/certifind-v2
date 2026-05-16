"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CourseCard, { Course } from "./CourseCard";
import { Loader2, BookX } from "lucide-react";

export default function CourseGrid({ courseType }: { courseType: "Free" | "Paid" }) {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Minimal pagination state for this setup (could be expanded to infinite load)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());

  const fetchCourses = useCallback(async (pageNum: number, append: boolean = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiParams = new URLSearchParams(searchParams.toString());
      apiParams.set('course_type', courseType);
      apiParams.set('page', pageNum.toString());
      
      const res = await fetch(`/api/courses?${apiParams.toString()}`);
      const data = await res.json();
      
      if (res.ok && data.courses) {
        if (append) {
          setCourses(prev => [...prev, ...data.courses]);
        } else {
          setCourses(data.courses);
        }
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
  }, [searchParams, courseType]);

  // Triggers on searchParams change
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchCourses(1, false);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchParams, fetchCourses]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchCourses(next, true);
  };

  const visibleCourseIdsKey = useMemo(
    () => courses.map((course) => course.course_id).join(","),
    [courses]
  );

  useEffect(() => {
    if (!visibleCourseIdsKey) {
      setBookmarkedIds(new Set());
      return;
    }

    const controller = new AbortController();

    fetch(`/api/bookmarks?courseIds=${encodeURIComponent(visibleCourseIdsKey)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) return { bookmarkedCourseIds: [] };
        if (!response.ok) throw new Error("Bookmark status failed");
        return response.json() as Promise<{ bookmarkedCourseIds?: string[] }>;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setBookmarkedIds(new Set(data.bookmarkedCourseIds || []));
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn("Bookmark batch status failed:", err);
          setBookmarkedIds(new Set());
        }
      });

    return () => controller.abort();
  }, [visibleCourseIdsKey]);

  const handleBookmarkToggle = useCallback((courseId: string, nextState: boolean) => {
    setBookmarkedIds((current) => {
      const next = new Set(current);
      if (nextState) next.add(courseId);
      else next.delete(courseId);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[460px] bg-neutral-900/50 animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/20 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
        <BookX className="w-16 h-16 text-neutral-600 mb-4" />
        <h3 className="text-2xl font-black text-white mb-2">No courses found</h3>
        <p className="text-neutral-500">Try adjusting your filters or clearing the search bar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {courses.map((course, idx) => (
          <div key={course.course_id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 6) * 100}ms` }}>
            <CourseCard
              course={course}
              isBookmarked={bookmarkedIds.has(course.course_id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-12 px-8 py-4 bg-certifind-bg border border-certifind-accent/50 hover:bg-certifind-accent/10 text-certifind-accent font-black tracking-widest uppercase rounded-full transition-all flex items-center justify-center gap-2"
        >
          {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Load More Results'}
        </button>
      )}
    </div>
  );
}
