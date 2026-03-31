'use client'

import React, { useState, useEffect } from 'react'
import { Search, Info } from 'lucide-react'
import PlatformGrid from '@/components/PlatformGrid'
import { supabase } from '@/lib/supabase'

interface Platform {
  id: string
  name: string
  category: string
  type: string
  best_for: string
  website_url: string
  icon_name: string
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    async function fetchPlatforms() {
      setLoading(true)
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('category')
      
      if (data) {
        setPlatforms(data)
      }
      setLoading(false)
    }

    fetchPlatforms()
  }, [supabase])

  const filteredPlatforms = platforms.filter(platform => 
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-certifind-bg selection:bg-certifind-accent selection:text-white px-4 py-12 md:px-8 lg:px-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-certifind-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-certifind-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-certifind-accent/10 border border-certifind-accent/30 rounded-full text-xs font-bold text-certifind-accent tracking-widest uppercase mb-4 animate-fade-in-up">
            <Info size={14} />
            <span>Discover Learning Ecosystems</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight animate-fade-in-up">
            World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-certifind-accent to-blue-400">Platforms</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium animate-fade-in-up">
            Find the best university-backed, skill-based, and creative courses across the globe's top 32 education providers.
          </p>
        </div>

        {/* Search & Statistics */}
        <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
          <div className="relative w-full max-w-3xl group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-certifind-accent transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text"
              placeholder="Search major platforms (e.g. Coursera, Udemy, NPTEL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-certifind-bg/60 backdrop-blur-xl border-2 border-white/5 rounded-3xl focus:outline-none focus:ring-4 focus:ring-certifind-accent/20 focus:border-certifind-accent text-white text-lg font-medium transition-all shadow-2xl"
            />
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center p-5 bg-certifind-accent/5 rounded-3xl border border-white/5 min-w-[150px]">
             <span className="text-3xl font-black text-white">{platforms.length}</span>
             <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Platforms Indexed</span>
          </div>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-40">
                <div className="w-16 h-16 border-4 border-certifind-accent/20 border-t-certifind-accent rounded-full animate-spin" />
            </div>
        ) : (
            <PlatformGrid 
                platforms={filteredPlatforms} 
                filterType={filterType} 
                onFilterChange={setFilterType} 
            />
        )}
      </div>
    </div>
  )
}
