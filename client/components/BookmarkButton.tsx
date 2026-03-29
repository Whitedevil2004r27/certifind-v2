"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookmarkButton({ courseId }: { courseId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkBookmark = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      
      setUser(session.user);
      
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', session.user.id)
        .single();
        
      if (data) {
        setIsBookmarked(true);
      }
      setLoading(false);
    };
    
    checkBookmark();
  }, [courseId]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // Don't trigger any parent links
    
    if (!user) {
      alert("Please sign in to bookmark courses!");
      return;
    }

    // Optimistic UI
    setIsBookmarked(!isBookmarked);

    if (isBookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('course_id', courseId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('bookmarks')
        .insert({ course_id: courseId, user_id: user.id });
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
