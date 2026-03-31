import React from 'react'
import { Check, Search } from 'lucide-react'
import { platformIconMap } from '@/lib/platformIconMap'

interface Platform {
  name: string
  category: string
  icon_name?: string
}

interface PlatformFilterProps {
  platforms: Platform[]
  selectedPlatforms: string[]
  onTogglePlatform: (platformName: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const categories = [
  'Global',
  'Tech & Development',
  'Indian',
  'Design & Creative',
  'Business & Management'
]

const PlatformFilter: React.FC<PlatformFilterProps> = ({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="w-full h-full flex flex-col pt-1 pb-10">
      {/* Search Bar */}
      <div className="relative group mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-certifind-accent transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search platforms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-certifind-accent/50 focus:border-certifind-accent text-white text-sm transition-all"
        />
      </div>

      {/* Category Groups */}
      <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {categories.map((category) => {
          const categoryPlatforms = platforms.filter(p => p.category === category)
          if (categoryPlatforms.length === 0) return null

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1 italic">
                {category}
              </h3>
              
              <div className="flex flex-col gap-1">
                {categoryPlatforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.name)
                  const Icon = platformIconMap[platform.name]

                  return (
                    <button
                      key={platform.name}
                      onClick={() => onTogglePlatform(platform.name)}
                      className={`group flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-300 ${
                        isSelected 
                        ? 'bg-certifind-accent/20 border border-certifind-accent/30 text-certifind-accent shadow-[0_0_15px_rgba(114,38,255,0.15)]' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/10 text-white/70'
                      }`}
                    >
                      <div className={`relative flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-300 ${
                        isSelected 
                        ? 'bg-certifind-accent border-transparent text-white' 
                        : 'bg-white/5 border-white/10 text-white/40 group-hover:border-white/20'
                      }`}>
                        {Icon && <Icon size={16} />}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-white text-certifind-accent rounded-full p-0.5 shadow-md">
                            <Check size={8} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      
                      <span className="text-sm font-medium tracking-tight">
                        {platform.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
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

export default PlatformFilter
