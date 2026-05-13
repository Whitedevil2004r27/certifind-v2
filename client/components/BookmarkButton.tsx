"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BookmarkButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const checkBookmark = async () => {
      try {
        const response = await fetch(`/api/bookmarks?courseId=${encodeURIComponent(courseId)}`, {
          signal: controller.signal,
        });

        if (response.status === 401) {
          setIsBookmarked(false);
          return;
        }

        if (!response.ok) return;

        const status = await response.json();
        setIsBookmarked(Boolean(status.isBookmarked));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Bookmark status failed:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkBookmark();

    return () => controller.abort();
  }, [courseId]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (response.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Bookmark toggle failed");
      setIsBookmarked(result.isBookmarked);
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };


  if (loading) return null; // Don't show anything while calculating state

  return (
    <button
      onClick={toggleBookmark}
      className={`absolute top-5 right-20 z-20 p-2 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 hover:scale-110 ${
        isBookmarked 
          ? "bg-rose-500/20 border-rose-500/30 text-rose-500 hover:bg-rose-500/30" 
          : "bg-black/40 border-white/10 text-white/50 hover:bg-black/60 hover:text-white"
      }`}
      title={isBookmarked ? "Remove Bookmark" : "Save Course"}
    >
      <Heart className={`w-4 h-4 ${isBookmarked ? "fill-rose-500" : ""}`} />
    </button>
  );
}
