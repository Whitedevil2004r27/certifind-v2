"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const DEPARTMENTS = [
  "Computer Science Engineering",
  "Information Technology",
  "Web Development",
  "Mobile App Development",
  "Database Management",
  "Data Science Engineering",
  "Python for Data Science",
  "Machine Learning",
  "AWS (Solutions Architect, Developer, SysOps)",
  "DevOps & CI/CD",
  "Network Security"
];

const PLATFORMS = ["Udemy", "Coursera", "LinkedIn Learning"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to read arrays from URL
  const selectedDepts = searchParams.getAll("department");
  const selectedPlatforms = searchParams.getAll("platform");
  const selectedLevels = searchParams.getAll("level");
  
  const currentMinRating = searchParams.get("min_rating") || "";
  const currentMaxDuration = searchParams.get("max_duration") || "";

  const toggleArrayFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);
    
    // Remove all existing of this key
    params.delete(key);
    
    // Re-add them, toggling the selected one
    let newValues = [...currentValues];
    if (newValues.includes(value)) {
      newValues = newValues.filter(v => v !== value);
    } else {
      newValues.push(value);
    }
    
    newValues.forEach(v => params.append(key, v));
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const setSingleFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("department");
    params.delete("platform");
    params.delete("level");
    params.delete("min_rating");
    params.delete("max_duration");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full bg-certifind-bg/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl h-fit sticky top-24">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-wide">Filters</h2>
        <button 
          onClick={clearAll}
          className="text-xs font-semibold text-neutral-400 hover:text-certifind-accent transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        
        {/* PLATFORMS */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Platform</h3>
          <div className="space-y-3">
            {PLATFORMS.map((platform) => (
              <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => toggleArrayFilter("platform", platform)}
                  className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DEPARTMENTS */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Department</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {DEPARTMENTS.map((dept) => (
              <label key={dept} className="flex flex-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedDepts.includes(dept)}
                  onChange={() => toggleArrayFilter("department", dept)}
                  className="w-4 h-4 mt-0.5 rounded bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer flex-shrink-0"
                />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* LEVEL */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Difficulty Level</h3>
          <div className="space-y-3">
            {LEVELS.map((level) => (
              <label key={level} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleArrayFilter("level", level)}
                  className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RATING */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Minimum Rating</h3>
          <div className="space-y-3">
            {["4.5", "4.0", "3.5", "3.0"].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="min_rating"
                  checked={currentMinRating === rating}
                  onChange={() => setSingleFilter("min_rating", rating)}
                  className="w-4 h-4 rounded-full bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{rating} & Up</span>
              </label>
            ))}
          </div>
        </div>

        {/* DURATION */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Max Duration</h3>
          <div className="space-y-3">
            {[
              { label: "1-4 Hours", value: "4" },
              { label: "1-10 Hours", value: "10" },
              { label: "1-20 Hours", value: "20" },
              { label: "Any Duration", value: "" }
            ].map((dur) => (
              <label key={dur.label} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="max_duration"
                  checked={currentMaxDuration === dur.value}
                  onChange={() => setSingleFilter("max_duration", dur.value)}
                  className="w-4 h-4 rounded-full bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{dur.label}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
