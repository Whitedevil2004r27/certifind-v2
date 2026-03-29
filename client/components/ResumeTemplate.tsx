"use client";

import { CheckCircle2, Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    period: string;
    description: string[];
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
}

export default function ResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div 
      id="resume-content"
      className="bg-white text-black p-12 w-[800px] min-h-[1132px] font-sans shadow-2xl mx-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-8 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2 uppercase italic">
            {data.fullName}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            {data.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {data.email}</div>}
            {data.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {data.phone}</div>}
            {data.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {data.location}</div>}
          </div>
        </div>
        <div className="flex gap-3">
          {data.linkedin && <Linkedin className="w-5 h-5 text-gray-400" />}
          {data.website && <Globe className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Left Column - Sidebar */}
        <div className="col-span-1 border-r border-gray-100 pr-6">
          <section className="mb-8">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Core Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-[10px] font-black uppercase border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">
              Education
            </h3>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="text-xs font-black text-gray-800 uppercase">{edu.degree}</div>
                <div className="text-[10px] text-gray-500 font-bold">{edu.school}</div>
                <div className="text-[10px] text-blue-500 font-black italic">{edu.year}</div>
              </div>
            ))}
          </section>

          <div className="mt-20 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated via</div>
            <div className="text-sm font-black text-blue-600 tracking-tighter italic">CertiFind</div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2">
          <section className="mb-10">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Professional Experience
            </h3>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-gray-100">
                  <div className="absolute -left-1.5 top-0 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{exp.role}</h4>
                      <div className="text-xs font-bold text-blue-600">{exp.company}</div>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase">{exp.period}</div>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="text-xs text-gray-600 leading-relaxed font-medium">
                        • {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Key Projects & Impact
            </h3>
            <div className="space-y-4">
              <div className="text-xs text-gray-600 leading-relaxed font-medium italic">
                Optimized enterprise catalog performance by 40% and implemented AI-based skill-gap analysis within a Next.js 15 framework.
              </div>
              <div className="text-xs text-gray-600 leading-relaxed font-medium italic">
                Architected serverless API integrations for high-scale course discovery platforms.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
