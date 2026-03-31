import React from 'react'
import { platformIconMap } from '@/lib/platformIconMap'

interface PlatformBadgeProps {
  name: string
  category: string
  className?: string
}

const categoryColors: Record<string, string> = {
  'Global': 'border-[#7226FF]/30 bg-[#7226FF]/10 text-[#7226FF]',
  'Tech & Development': 'border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0EA5E9]',
  'Indian': 'border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316]',
  'Design & Creative': 'border-[#EC4899]/30 bg-[#EC4899]/10 text-[#EC4899]',
  'Business & Management': 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]',
}

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ name, category, className = '' }) => {
  const Icon = platformIconMap[name] || platformIconMap['Coursera'] // Fallback
  const colorClasses = categoryColors[category] || categoryColors['Global']

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-300 ${colorClasses} ${className}`}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      <span>{name}</span>
    </div>
  )
}

export default PlatformBadge
