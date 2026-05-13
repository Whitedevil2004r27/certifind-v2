"use client";

import React from 'react';
import * as Icons from 'lucide-react';
import { Sparkles } from 'lucide-react';

const SPOTLIGHT_PLATFORMS = [
  { name: 'Coursera', category: 'Global', icon: 'GraduationCap' },
  { name: 'Udemy', category: 'Global', icon: 'BookOpen' },
  { name: 'edX', category: 'Global', icon: 'GraduationCap' },
  { name: 'LinkedIn Learning', category: 'Global', icon: 'Linkedin' },
  { name: 'Khan Academy', category: 'Global', icon: 'Brain' },
  { name: 'freeCodeCamp', category: 'Tech', icon: 'Code2' },
  { name: 'NPTEL', category: 'Indian', icon: 'GraduationCap' },
  { name: 'upGrad', category: 'Indian', icon: 'GraduationCap' },
  { name: 'Domestika', category: 'Design', icon: 'Palette' },
  { name: 'Harvard Online', category: 'Business', icon: 'Building2' },
];

export default function PlatformSpotlight() {
  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-certifind-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-certifind-accent/10 text-certifind-accent px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-certifind-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> Discovery Ecosystem
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Aggregating <span className="text-certifind-accent">32+</span> Global Platforms
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            One unified search for courses from the world's most prestigious universities and technical bootcamps.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SPOTLIGHT_PLATFORMS.map((platform) => {
            const IconComponent = (Icons as any)[platform.icon] || Icons.Minus;
            return (
              <div 
                key={platform.name}
                className="group p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 hover:border-certifind-accent/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-certifind-accent/20 group-hover:scale-110 transition-all duration-500 border border-white/10">
                  <IconComponent className="w-8 h-8 text-neutral-400 group-hover:text-certifind-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                <span className="text-[10px] font-black tracking-widest text-certifind-accent uppercase">{platform.category}</span>
                
                {/* Decorative Elements */}
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-certifind-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4">
            <span className="h-[1px] w-12 bg-neutral-800" /> And 22 More Specialists <span className="h-[1px] w-12 bg-neutral-800" />
          </p>
        </div>
      </div>
    </div>
  );
}
