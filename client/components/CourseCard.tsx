import { ExternalLink, Star } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  is_free: boolean;
  price: string;
  rating: number;
  thumbnail: string;
  course_url: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group flex flex-col h-full bg-neutral-900/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 hover:bg-neutral-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]">
      <div className="relative h-52 w-full overflow-hidden bg-neutral-950 p-2 pb-0">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-900/60 to-transparent z-10 pointer-events-none" />
        <img 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"} 
          alt={course.title} 
          className="object-cover w-full h-full rounded-t-[1.5rem] group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-5 left-5 z-20 flex gap-2">
          {course.is_free ? (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black tracking-wider px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              FREE
            </span>
          ) : (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black tracking-wider px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              {course.price || "PAID"}
            </span>
          )}
        </div>
        <div className="absolute top-5 right-5 z-20">
          <span className="bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {course.rating.toFixed(1)}
          </span>
        </div>
        <BookmarkButton courseId={course.id} />
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20">
          {course.platform}
        </div>
        
        <div className="mb-4 mt-2">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">{course.category}</span>
        </div>
        
        <h3 className="text-xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
          {course.title}
        </h3>
        
        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
          {course.description}
        </p>
        
        <a 
          href={course.course_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 border border-white/10 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] group/btn"
        >
          Enroll Now <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
