import React from 'react'
import PlatformCard from './PlatformCard'

interface Platform {
  id: string
  name: string
  category: string
  type: string
  best_for: string
  website_url: string
  icon_name: string
}

interface PlatformGridProps {
  platforms: Platform[]
  filterType: string
  onFilterChange: (type: string) => void
}

const categories = [
  'Global',
  'Tech & Development',
  'Indian',
  'Design & Creative',
  'Business & Management'
]

const PlatformGrid: React.FC<PlatformGridProps> = ({ platforms, filterType, onFilterChange }) => {
  const filteredPlatforms = filterType === 'All' 
    ? platforms 
    : platforms.filter(p => p.type.includes(filterType))

  return (
    <div className="space-y-12">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#010030]/20 p-2 rounded-2xl border border-certifind-border/50 backdrop-blur-sm">
        {['All', 'Free', 'Paid'].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
              filterType === type 
              ? 'bg-certifind-accent text-white shadow-[0_0_20px_rgba(114,38,255,0.4)] scale-105' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {type} Platforms
          </button>
        ))}
        
        <div className="ml-auto px-4 text-xs font-medium text-white/40 italic">
          Showing {filteredPlatforms.length} platforms
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-16">
        {categories.map((category) => {
          const categoryPlatforms = filteredPlatforms.filter(p => p.category === category)
          if (categoryPlatforms.length === 0) return null

          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic underline decoration-certifind-accent decoration-4 underline-offset-8">
                  {category}
                </h2>
                <div className="h-[2px] flex-grow bg-gradient-to-r from-certifind-accent/40 to-transparent rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryPlatforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      {filteredPlatforms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-certifind-accent/10 rounded-full mb-4">
               <div className="w-12 h-12 border-2 border-certifind-accent border-dashed rounded-full animate-spin" />
            </div>
          <h3 className="text-xl font-bold text-white mb-2">No platforms found</h3>
          <p className="text-white/40 max-w-xs">We couldn't find any platforms matching your criteria. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}

export default PlatformGrid
