import React from 'react'
import { ExternalLink } from 'lucide-react'
import { platformIconMap } from '@/lib/platformIconMap'
import PlatformBadge from './PlatformBadge'

interface Platform {
  id: string
  name: string
  category: string
  type: string
  best_for: string
  website_url: string
  icon_name: string
}

interface PlatformCardProps {
  platform: Platform
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const Icon = platformIconMap[platform.name] || platformIconMap['Coursera']

  return (
    <div className="group relative bg-[#010030]/40 p-6 rounded-2xl border border-certifind-border hover:border-certifind-accent/60 transition-all duration-500 overflow-hidden backdrop-blur-md">
      {/* Background Glow Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-certifind-accent/5 rounded-full blur-[50px] group-hover:bg-certifind-accent/10 transition-all duration-500" />
      
      <div className="flex flex-col h-full space-y-5">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-certifind-accent/10 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-certifind-accent/20">
            {Icon && <Icon className="text-certifind-accent w-6 h-6" strokeWidth={2} />}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-certifind-accent/80 bg-certifind-accent/5 px-2 py-0.5 rounded border border-certifind-accent/10">
              {platform.type}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-certifind-accent transition-colors">
            {platform.name}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2 min-h-[40px]">
            {platform.best_for}
          </p>
        </div>

        <div className="pt-2">
          <PlatformBadge name={platform.name} category={platform.category} />
        </div>

        <div className="mt-auto pt-4">
          <a 
            href={platform.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-certifind-accent/10 hover:bg-certifind-accent text-white text-sm font-semibold rounded-xl border border-certifind-accent/30 hover:border-transparent transition-all duration-300"
          >
            <span>Visit Platform</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PlatformCard
