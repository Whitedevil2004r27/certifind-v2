import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { platformIconMap } from '@/lib/platformIconMap'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'

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
]

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"]

interface Platform {
  name: string
  category: string
}

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loadingPlatforms, setLoadingPlatforms] = useState(true)
  const [platformSearch, setPlatformSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Global'])

  useEffect(() => {
    async function fetchPlatforms() {
      const { data } = await supabase
        .from('platforms')
        .select('name, category')
        .order('category')
      if (data) setPlatforms(data)
      setLoadingPlatforms(false)
    }
    fetchPlatforms()
  }, [])

  const selectedDepts = searchParams.getAll("department")
  const selectedPlatforms = searchParams.getAll("platform")
  const selectedLevels = searchParams.getAll("level")
  const currentMinRating = searchParams.get("min_rating") || ""
  const currentMaxDuration = searchParams.get("max_duration") || ""

  const updateFilters = useCallback((key: string, value: string, isArray: boolean = true) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (isArray) {
      const currentValues = params.getAll(key)
      params.delete(key)
      let newValues = [...currentValues]
      if (newValues.includes(value)) {
        newValues = newValues.filter(v => v !== value)
      } else {
        newValues.push(value)
      }
      newValues.forEach(v => params.append(key, v))
    } else {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  const clearAll = () => {
    router.push('?')
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const groupedPlatforms = platforms.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Platform[]>)

  return (
    <div className="w-full bg-[#010030]/40 border border-certifind-border rounded-3xl p-6 backdrop-blur-xl h-fit sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-wide">Filters</h2>
        <button 
          onClick={clearAll}
          className="text-xs font-semibold text-certifind-accent hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        
        {/* PLATFORMS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Platforms</h3>
            <span className="text-[10px] font-bold text-certifind-accent bg-certifind-accent/10 px-2 py-0.5 rounded">
              {selectedPlatforms.length} Selected
            </span>
          </div>

          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-certifind-accent" />
            <input 
              type="text"
              placeholder="Search platforms..."
              value={platformSearch}
              onChange={(e) => setPlatformSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-certifind-accent transition-all"
            />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(groupedPlatforms).map((category) => {
              const filtered = groupedPlatforms[category].filter(p => 
                p.name.toLowerCase().includes(platformSearch.toLowerCase())
              )
              if (filtered.length === 0) return null

              const isExpanded = expandedCategories.includes(category) || platformSearch.length > 0

              return (
                <div key={category} className="space-y-2">
                  <button 
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-colors py-1"
                  >
                    <span>{category}</span>
                    {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-2 pl-1">
                      {filtered.map((platform) => {
                        const Icon = platformIconMap[platform.name]
                        const isChecked = selectedPlatforms.includes(platform.name)
                        return (
                          <label key={platform.name} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => updateFilters("platform", platform.name)}
                                className="peer sr-only"
                              />
                              <div className="w-5 h-5 rounded-lg border-2 border-white/10 bg-white/5 peer-checked:bg-certifind-accent peer-checked:border-certifind-accent transition-all" />
                              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                <Search size={10} strokeWidth={4} /> {/* Placeholder for checkmark logic */}
                              </div>
                            </div>
                            <div className={`p-1 rounded bg-white/5 border border-white/5 text-neutral-500 group-hover:text-certifind-accent transition-colors ${isChecked ? 'text-certifind-accent border-certifind-accent/30' : ''}`}>
                               {Icon && <Icon size={12} />}
                            </div>
                            <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                              {platform.name}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* DEPARTMENTS */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Department</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {DEPARTMENTS.map((dept) => (
              <label key={dept} className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedDepts.includes(dept)}
                  onChange={() => updateFilters("department", dept)}
                  className="w-4 h-4 mt-0.5 rounded bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer flex-shrink-0"
                />
                <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors leading-tight">{dept}</span>
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
                  onChange={() => updateFilters("level", level)}
                  className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RATING */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Min Rating</h3>
          <div className="space-y-3">
            {["4.5", "4.0", "3.5", "3.0"].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="min_rating"
                  checked={currentMinRating === rating}
                  onChange={() => updateFilters("min_rating", rating, false)}
                  className="w-4 h-4 rounded-full bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">{rating} & Up</span>
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
                  onChange={() => updateFilters("max_duration", dur.value, false)}
                  className="w-4 h-4 rounded-full bg-neutral-900 border-white/20 text-certifind-accent focus:ring-certifind-accent/50 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">{dur.label}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(114, 38, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(114, 38, 255, 0.4);
        }
      `}</style>
    </div>
  )
}
