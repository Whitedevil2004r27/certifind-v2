import { ExternalLink, Star, Clock, Award, Bookmark } from "lucide-react";
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
  const getContextKeyword = () => {
    const text = (course.department + " " + course.title).toLowerCase();
    if (text.includes("data") || text.includes("machine learning") || text.includes("ai")) return "data,technology";
    if (text.includes("web") || text.includes("software") || text.includes("react")) return "programming,code";
    if (text.includes("cloud") || text.includes("aws") || text.includes("devops")) return "server,technology";
    if (text.includes("cyber") || text.includes("security") || text.includes("hack")) return "cybersecurity,hacker";
    if (text.includes("agri") || text.includes("hydroponic")) return "agriculture,farm";
    if (text.includes("pharm") || text.includes("clinical")) return "medical,laboratory";
    return "education,university";
  };

  const getHashLock = () => {
    let h = 0;
    for (let i = 0; i < course.course_id.length; i++) h = course.course_id.charCodeAt(i) + ((h << 5) - h);
    return Math.abs(h);
  };

  const imgSrc = (!course.thumbnail_url || course.thumbnail_url.includes('source.unsplash.com'))
    ? `https://loremflickr.com/400/220/${getContextKeyword()}?lock=${getHashLock()}`
    : course.thumbnail_url;

  return (
    <a
      href={course.course_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View course: ${course.title}`}
      className="group flex flex-col bg-neutral-900 border border-white/8 rounded-xl overflow-hidden hover:border-certifind-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(114,38,255,0.35)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-certifind-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      
      {/* Thumbnail */}
      <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
        <img
          src={imgSrc}
          alt={course.title}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = `https://loremflickr.com/400/220/${getContextKeyword()}?random=${getHashLock()}`; }}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {course.course_type === 'Free' && (
            <span className="bg-certifind-accent text-white text-[10px] font-black px-2 py-0.5 rounded-full">FREE</span>
          )}
          {course.is_bestseller && (
            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Award className="w-2.5 h-2.5" /> Best
            </span>
          )}
          {course.is_new && (
            <span className="bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>
          )}
        </div>
        {/* Rating */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 border border-white/10">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {(course.rating || 0).toFixed(1)}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 gap-2 relative">
        {/* Platform + Level */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-certifind-accent uppercase tracking-wider truncate max-w-[55%]">
            {course.platform}
          </span>
          <span className="text-[10px] text-white/50 font-semibold bg-white/5 px-1.5 py-0.5 rounded uppercase">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-certifind-accent transition-colors duration-200">
          {course.title}
        </h3>

        {/* Instructor + Duration */}
        <div className="flex items-center justify-between text-[11px] text-white/40 mt-auto pt-2 border-t border-white/5">
          <span className="truncate max-w-[60%]">{course.instructor_name}</span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" /> {course.duration_hours}h
          </span>
        </div>

        {/* Enroll CTA — visual indicator only, card itself is the link */}
        <div className="mt-1 w-full bg-certifind-accent/10 group-hover:bg-certifind-accent text-certifind-accent group-hover:text-white border border-certifind-accent/30 group-hover:border-certifind-accent font-bold py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-xs">
          Enroll Now <ExternalLink className="w-3 h-3" />
        </div>

        {/* Bookmark — stops card click from propagating */}
        <div
          className="absolute top-3 right-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <BookmarkButton courseId={course.course_id} />
        </div>
      </div>
    </a>
  );
}
