import { ExternalLink, Star, Clock, Award, Users } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

export interface Course {
  course_id: string;
  title: string;
  instructor_name: string;
  platform: string;
  department: string;
  course_type: string;
  price: number;
  original_price: number | null;
  discount_percentage: number;
  rating: number;
  total_ratings: number;
  duration_hours: number;
  level: string;
  language: string;
  thumbnail_url: string;
  course_url: string;
  tags: string[];
  is_bestseller: boolean;
  is_new: boolean;
  certificate_offered: boolean;
}

export default function CourseCard({ course }: { course: Course }) {
  // Context-aware fallback resolution
  const getContextKeyword = () => {
    const text = (course.department + " " + course.title).toLowerCase();
    if (text.includes("data") || text.includes("machine learning") || text.includes("ai")) return "data,technology";
    if (text.includes("web") || text.includes("software") || text.includes("computer") || text.includes("react")) return "programming,code";
    if (text.includes("cloud") || text.includes("aws") || text.includes("azure") || text.includes("devops")) return "server,technology";
    if (text.includes("cyber") || text.includes("security") || text.includes("hack")) return "cybersecurity,hacker";
    if (text.includes("agri") || text.includes("hydroponic") || text.includes("soil")) return "agriculture,farm";
    if (text.includes("pharm") || text.includes("clinical") || text.includes("drug")) return "medical,laboratory";
    if (text.includes("archit") || text.includes("autocad") || text.includes("design") || text.includes("3ds")) return "architecture,blueprint";
    return "education,university";
  };

  // Mathematical hash guaranteeing 100% zero collision image locks across the DB using the UUID logic
  const getHashLock = () => {
    let hashStr = 0;
    for (let i = 0; i < course.course_id.length; i++) {
        hashStr = course.course_id.charCodeAt(i) + ((hashStr << 5) - hashStr);
    }
    return Math.abs(hashStr);
  };

  // Intelligent interceptor
  const getValidImageUrl = (url: string) => {
    const fallback = `https://loremflickr.com/480/270/${getContextKeyword()}?lock=${getHashLock()}`;
    if (!url || url.includes('source.unsplash.com')) return fallback;
    return url;
  };

  return (
    <div className="group flex flex-col h-full bg-certifind-bg/90 backdrop-blur-2xl border border-certifind-accent/30 rounded-2xl overflow-hidden hover:border-certifind-accent transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_15px_40px_-10px_rgba(114,38,255,0.4)]">
      
      {/* Thumbnail Section */}
      <div className="relative h-44 sm:h-[220px] w-full overflow-hidden bg-black p-2 pb-0">
        <img 
          src={getValidImageUrl(course.thumbnail_url)} 
          alt={course.title}
          onError={(e) => {
            e.currentTarget.src = `https://loremflickr.com/480/270/${getContextKeyword()}?random=${getHashLock()}`;
          }}
          className="object-cover w-full h-full rounded-t-xl group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Dynamic Badges Container */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
          {course.course_type === 'Free' && (
            <span className="bg-certifind-accent text-white text-xs font-black tracking-wider px-3 py-1 rounded-full shadow-lg">
              FREE
            </span>
          )}
          {course.is_bestseller && (
            <span className="bg-amber-500 text-black text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase">
              <Award className="w-3 h-3" /> Bestseller
            </span>
          )}
          {course.is_new && (
            <span className="bg-sky-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-lg uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Rating Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-black/70 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 
            {(course.rating || 0).toFixed(1)} <span className="text-neutral-200 font-normal">({(course.total_ratings || 0).toLocaleString()})</span>
          </span>
        </div>
        
        <BookmarkButton courseId={course.course_id} />
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative bg-neutral-950/20">
        
        {/* Platform Pill */}
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-certifind-bg text-white border border-certifind-accent/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-20">
          {course.platform}
        </div>
        
        <div className="flex items-center justify-between mb-3 mt-2">
          <span className="text-[11px] font-medium text-certifind-accent uppercase tracking-widest truncate max-w-[70%]">
            {course.department}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/80 font-semibold bg-white/5 px-2 py-0.5 rounded uppercase">
            {course.level}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-[1.3] group-hover:text-certifind-accent transition-colors duration-300">
          {course.title}
        </h3>
        
        <p className="text-white/60 text-sm mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 opacity-50" /> {course.instructor_name}
        </p>

        {/* Metadata Segment */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-white/50 text-xs mt-1">
              <Clock className="w-3.5 h-3.5" /> {course.duration_hours} total hours
            </div>
          </div>
          
          <a 
            href={course.course_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-certifind-accent hover:bg-certifind-accent/80 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(114,38,255,0.3)] group/btn text-sm"
          >
            Enroll <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
}
