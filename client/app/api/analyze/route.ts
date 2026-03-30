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
        .select('course_id, title, department, tags, rating')
    ]);
    
    if (dbError || !courses) {
      throw dbError || new Error('No courses found in database');
    }

    if (!extracted || !extracted.text) {
      throw new Error('No text extracted from PDF. The file may be empty or encrypted.');
    }
    
    // Join text if it comes as an array (common in some unpdf versions)
    const rawText = Array.isArray(extracted.text) ? extracted.text.join(' ') : extracted.text;
    const resumeText = rawText.toLowerCase();

    // 1. Identify skills present in resume (O(n) skills in DB)
    const ALL_SKILLS = Array.from(new Set(courses.flatMap(c => [
      (c.department || "").toLowerCase(),
      ...(c.tags || []).map((t: string) => (t || "").toLowerCase())
    ])));

    const matchedSkillsList = ALL_SKILLS.filter(skill => skill && resumeText.includes(skill.toLowerCase()));
    const matchedSkillsSet = new Set(matchedSkillsList);

    // 2. Optimized Scoring Algorithm (O(n) courses)
    const recommendations = courses.map(course => {
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
        // Impact Score: Combination of new skills provided and course quality
        impactScore: (newSkillsCount * 2) + (course.rating || 0)
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3); // Top 3 recommendations

    return NextResponse.json({
      detectedSkills: matchedSkillsList.slice(0, 10), // Limit for UI
      recommendations,
      summary: `We analyzed your profile and found ${matchedSkillsList.length} core competencies. Based on current industry demand in our database, we identified ${recommendations.length} key growth areas.`
    });

  } catch (err: any) {
    console.error('AI Analyzer Final Error:', err.message, err.stack);
    return NextResponse.json({ 
      error: 'Failed to analyze resume',
      details: err.message
    }, { status: 500 });
  }
}
