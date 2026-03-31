import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractText } from 'unpdf';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      console.error('Analyzer: No file provided');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer as Required by unpdf
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    
    // Performance Optimization: Run PDF Parsing and Database Fetching in Parallel
    const [extracted, { data: courses, error: dbError }] = await Promise.all([
      extractText(uint8Array).catch(err => {
        console.error('unpdf Parse Internal Error:', err.message);
        return null;
      }),
      supabase
        .from('courses')
        .select(`
          course_id, 
          title, 
          department, 
          tags, 
          rating, 
          level, 
          platforms (
            name,
            category
          )
        `)
    ]);
    
    if (dbError || !courses) {
      throw dbError || new Error('No courses found in database');
    }

    if (!extracted || !extracted.text) {
      throw new Error('No text extracted from PDF. The file may be empty or encrypted.');
    }
    
    const rawText = Array.isArray(extracted.text) ? extracted.text.join(' ') : extracted.text;
    const resumeText = rawText.toLowerCase();

    // 1. Identify skills
    const ALL_SKILLS = Array.from(new Set(courses.flatMap(c => [
      (c.department || "").toLowerCase(),
      ...(c.tags || []).map((t: string) => (t || "").toLowerCase())
    ])));

    const matchedSkillsList = ALL_SKILLS.filter(skill => skill && resumeText.includes(skill.toLowerCase()));
    const matchedSkillsSet = new Set(matchedSkillsList);

    // 2. Synthesize 3-Phase Roadmap
    // We want P1: Foundations, P2: Core, P3: Advanced
    const roadmapPhases = [
      { id: 'p1', title: 'Phase 1: Skill Foundations', levelMatch: ['Beginner', 'All Levels'] },
      { id: 'p2', title: 'Phase 2: Core Engineering', levelMatch: ['Intermediate', 'All Levels'] },
      { id: 'p3', title: 'Phase 3: Elite Specialization', levelMatch: ['Advanced'] }
    ];

    const recommendations = roadmapPhases.map(phase => {
      const candidates = courses.filter(c => phase.levelMatch.includes(c.level || 'All Levels'));
      
      const scores = (candidates.length > 0 ? candidates : courses).map(course => {
        const courseSkills = [
          (course.department || "").toLowerCase(),
          ...(course.tags || []).map((t: string) => (t || "").toLowerCase())
        ];
        
        const newSkillsCount = courseSkills.filter(s => !matchedSkillsSet.has(s)).length;
        const matchScore = courseSkills.filter(s => matchedSkillsSet.has(s)).length;
        
        return {
          ...course,
          newSkillsCount,
          matchScore,
          phaseId: phase.id,
          phaseTitle: phase.title,
          impactScore: (newSkillsCount * 3) + (course.rating || 0) + (matchScore * 0.5)
        };
      });

      return scores.sort((a, b) => b.impactScore - a.impactScore)[0];
    }).filter(Boolean);

    return NextResponse.json({
      detectedSkills: matchedSkillsList.slice(0, 10),
      recommendations,
      summary: `Our AI scanned your profile and identified ${matchedSkillsList.length} core competencies. We've structured a 3-phase roadmap to bridge your skill gaps and elevate your market value.`
    });

  } catch (err: any) {
    console.error('AI Analyzer Final Error:', err.message, err.stack);
    return NextResponse.json({ 
      error: 'Failed to analyze resume',
      details: err.message
    }, { status: 500 });
  }
}
