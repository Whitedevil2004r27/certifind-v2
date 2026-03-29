"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import CourseGrid from '@/components/CourseGrid';

function FreeCoursesContent() {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-[320px] flex-shrink-0 z-10">
        <FilterSidebar />
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 w-full flex flex-col space-y-8">
        <div className="flex justify-between items-center w-full bg-certifind-bg/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-neutral-400 text-sm font-medium">Viewing Open Source Curriculum</p>
          <SortDropdown />
        </div>
        
        <CourseGrid courseType="Free" />
      </div>
    </div>
  );
}

export default function FreeCoursesPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 max-w-[1400px] mx-auto px-6 relative">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 blur-[200px] rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-8 mb-16 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-500 text-xs font-black tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 uppercase">Zero Cost Access</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-sm">
            Auditing <span className="text-emerald-500 bg-clip-text">Catalog</span>
          </h1>
          <p className="text-neutral-300 text-lg leading-relaxed">
            Discover thousands of high-quality educational tracks available entirely for free. Learn foundational web frameworks, databases, and more immediately.
          </p>
        </div>
        <Suspense fallback={<div className="w-full max-w-md h-12 bg-white/5 rounded-2xl animate-pulse"/>}>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-[500px] w-full bg-white/5 rounded-3xl animate-pulse"/>}>
        <FreeCoursesContent />
      </Suspense>
    </div>
  );
}
