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
    
    // Extract text from PDF using the serverless-optimized unpdf engine
    let extracted;
    try {
      extracted = await extractText(uint8Array);
    } catch (parseError: any) {
      console.error('unpdf Parse Internal Error:', parseError.message, parseError.stack);
      return NextResponse.json({ 
        error: 'PDF parsing failed on server', 
        details: parseError.message 
      }, { status: 422 });
    }
    
    if (!extracted || !extracted.text) {
      throw new Error('No text extracted from PDF. The file may be empty or encrypted.');
    }
    
    // Join text if it comes as an array (common in some unpdf versions)
    const rawText = Array.isArray(extracted.text) ? extracted.text.join(' ') : extracted.text;
    const resumeText = rawText.toLowerCase();

    // 1. Fetch all unique departments and tags from the database to create a skill map
    const { data: courses, error } = await supabase
      .from('courses')
      .select('course_id, title, department, tags, rating, thumbnail_url');

    if (error || !courses) {
      throw error || new Error('No courses found in database');
    }

    // 2. Identify skills present in resume
    const ALL_SKILLS = Array.from(new Set(courses.flatMap(c => [
      (c.department || "").toLowerCase(),
      ...(c.tags || []).map((t: string) => (t || "").toLowerCase())
    ])));

    const matchedSkills = ALL_SKILLS.filter(skill => skill && resumeText.includes(skill.toLowerCase()));

    // 3. Simple Scoring Algorithm: "Resume Gap"
    // Calculate which courses offer the most value based on skills NOT in the resume
    const recommendations = courses.map(course => {
      const courseSkills = [
        course.department.toLowerCase(),
        ...(course.tags || []).map((t: string) => t.toLowerCase())
      ];
      
      const newSkillsCount = courseSkills.filter(s => !matchedSkills.includes(s)).length;
      const matchScore = courseSkills.filter(s => matchedSkills.includes(s)).length;
      
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
      detectedSkills: matchedSkills.slice(0, 10), // Limit for UI
      recommendations,
      summary: `We analyzed your profile and found ${matchedSkills.length} core competencies. Based on current industry demand in our database, we identified ${recommendations.length} key growth areas.`
    });

  } catch (err: any) {
    console.error('AI Analyzer Final Error:', err.message, err.stack);
    return NextResponse.json({ 
      error: 'Failed to analyze resume',
      details: err.message
    }, { status: 500 });
  }
}
