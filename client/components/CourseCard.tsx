"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Clock, BarChart, Bookmark, ExternalLink, Trophy } from 'lucide-react'
import PlatformBadge from './PlatformBadge'
import { usePathname, useRouter } from 'next/navigation'

export interface Course {
  course_id: string
  title: string
  description?: string
  instructor_name: string
  platform: string
  platforms?: {
    category: string
    name?: string
  }
  department: string
  course_type: string
  price: number
  original_price?: number
  discount_percentage?: number
  rating: number
  total_ratings: number
  duration_hours?: number
  level: string
  thumbnail_url?: string
  image_alt?: string
  updated_at?: string
  course_url: string
  certificate_offered?: boolean
  is_bestseller?: boolean
  is_new?: boolean
}

interface CourseCardProps {
  course: Course;
  onBookmarkToggle?: (courseId: string, isBookmarked: boolean) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onBookmarkToggle }) => {

  const router = useRouter()
  const pathname = usePathname()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const checkBookmark = async () => {
      try {
        const response = await fetch(`/api/bookmarks?courseId=${encodeURIComponent(course.course_id)}`, {
          signal: controller.signal,
        })

        if (response.status === 401) {
          setIsBookmarked(false)
          return
        }

        if (!response.ok) return

        const status = await response.json()
        setIsBookmarked(Boolean(status.isBookmarked))
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Bookmark status error:", error)
        }
      }
    }

    checkBookmark()

    return () => controller.abort()
  }, [course.course_id])

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.course_id }),
      })

      if (response.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Bookmark update failed')

      setIsBookmarked(result.isBookmarked)
      onBookmarkToggle?.(course.course_id, result.isBookmarked)
    } catch (err) {
      console.error("Bookmark error:", err)
    } finally {
      setLoading(false)
    }
  }


  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={14}
      className={i < Math.floor(course.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}
    />
  ))
  const price = Number(course.price || 0)
  const originalPrice = Number(course.original_price || 0)
  const discountPercentage = Number(course.discount_percentage || 0)

  return (
    <div 
      onClick={() => router.push(`/courses/${course.course_id}`)}
      className="group flex flex-col bg-certifind-bg/40 border border-white/5 rounded-3xl overflow-hidden hover:border-certifind-accent/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(114,38,255,0.1)] h-full backdrop-blur-sm relative cursor-pointer active:scale-[0.98]"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video overflow-hidden block">
        <Image
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
          alt={course.image_alt || course.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {course.is_bestseller && (
            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tight">
              Bestseller
            </span>
          )}
          {course.is_new && (
            <span className="bg-certifind-accent text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tight">
              New
            </span>
          )}
        </div>

        <button 
          onClick={toggleBookmark}
          disabled={loading}
          className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full transition-all border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 duration-300 z-20 ${
            isBookmarked ? 'bg-rose-500 text-white opacity-100 translate-y-0' : 'bg-black/40 text-white/60 hover:text-white'
          }`}
        >
          <Bookmark size={18} className={isBookmarked ? 'fill-white' : ''} />
        </button>

        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        
        <div className="absolute bottom-4 left-4">
          <PlatformBadge name={course.platform} category={course.platforms?.category || 'Global'} />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {ratingStars}
          </div>
          <span className="text-xs font-bold text-amber-400/80">({course.total_ratings.toLocaleString()})</span>
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-certifind-accent transition-colors leading-tight min-h-[44px]">
          {course.title}
        </h3>

        <p className="text-sm text-neutral-400 mb-4">{course.instructor_name}</p>

        {/* Course Details Meta */}
        <div className="grid grid-cols-2 gap-y-3 mb-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock size={14} />
            <span className="text-xs font-medium">{course.duration_hours?.toFixed(1) || '0'} hrs</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <BarChart size={14} />
            <span className="text-xs font-medium">{course.level}</span>
          </div>
          {course.certificate_offered && (
            <div className="flex items-center gap-2 text-neutral-500 col-span-2">
              <Trophy size={14} className="text-certifind-accent" />
              <span className="text-xs font-medium">Certification Offered</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {course.course_type === 'Free' ? 'FREE' : `$${price}`}
              </span>
              {originalPrice > price && (
                <span className="text-sm text-neutral-600 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="text-[10px] font-bold text-certifind-accent uppercase tracking-widest">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          <a
            href={course.course_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-5 py-2.5 bg-certifind-accent text-white text-sm font-bold rounded-xl hover:bg-certifind-accent/80 transition-all shadow-lg shadow-certifind-accent/20 z-10"
          >
            <span>Learn</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
