import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackCourses, withFallbackPlatform } from '@/lib/fallback-catalog';
import { extractText } from 'unpdf';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      console.error('Analyzer: No file provided');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Resume file must be 5MB or smaller' }, { status: 413 });
    }

    // Convert file to buffer as Required by unpdf
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    
    // Performance Optimization: Run PDF Parsing and Database Fetching in Parallel
    const [extracted, courses] = await Promise.all([
      extractText(uint8Array).catch(err => {
        console.error('unpdf Parse Internal Error:', err.message);
        return null;
      }),
      query<any>(`
        SELECT
          c.course_id,
          c.title,
          c.department,
          c.rating,
          c.level,
          c.platform,
          c.tags,
          c.total_ratings,
          p.category as platform_category
        FROM courses c
        LEFT JOIN platforms p ON c.platform = p.name
        ORDER BY c.rating DESC, c.total_ratings DESC
        LIMIT 400
      `).catch((err) => {
        console.warn('Analyzer using cached catalog:', err?.message || err);
        return fallbackCourses.map(withFallbackPlatform);
      })
    ]);
    
    if (!courses || courses.length === 0) {
      throw new Error('No courses found in database');
    }


    if (!extracted || !extracted.text) {
      throw new Error('No text extracted from PDF. The file may be empty or encrypted.');
    }
    
    const rawText = Array.isArray(extracted.text) ? extracted.text.join(' ') : extracted.text;
    const resumeText = rawText.toLowerCase();

    // 1. Identify skills
    const courseSkillMap = new Map<any, string[]>();
    const allSkillSet = new Set<string>();

    for (const course of courses) {
      const skills = [
        (course.department || "").toLowerCase(),
        ...(course.tags || []).map((tag: string) => (tag || "").toLowerCase()),
      ].filter(Boolean);

      courseSkillMap.set(course, skills);
      skills.forEach((skill) => allSkillSet.add(skill));
    }

    const matchedSkillsList = Array.from(allSkillSet).filter(skill => resumeText.includes(skill));
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

      let bestCourse: any = null;
      let bestScore = Number.NEGATIVE_INFINITY;

      for (const course of candidates.length > 0 ? candidates : courses) {
        const courseSkills = courseSkillMap.get(course) || [];
        const newSkillsCount = courseSkills.filter(s => !matchedSkillsSet.has(s)).length;
        const matchScore = courseSkills.filter(s => matchedSkillsSet.has(s)).length;

        const impactScore = (newSkillsCount * 3) + (course.rating || 0) + (matchScore * 0.5);

        if (impactScore > bestScore) {
          bestScore = impactScore;
          bestCourse = {
            ...course,
            newSkillsCount,
            matchScore,
            phaseId: phase.id,
            phaseTitle: phase.title,
            impactScore,
            platforms: course.platforms || {
              name: course.platform,
              category: course.platform_category || 'Global',
            },
          };
        }
      }

      return bestCourse;
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
