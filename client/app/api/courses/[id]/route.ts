import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getFallbackCourseById } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query<any>(
      `
      SELECT c.*, p.category as platform_category
      FROM courses c
      LEFT JOIN platforms p ON c.platform = p.name
      WHERE c.course_id = $1
      `,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = result[0];
    course.platforms = {
      name: course.platform,
      category: course.platform_category || 'Global',
    };

    return NextResponse.json(course);
  } catch (err: any) {
    console.error('Course detail API using cached catalog:', err);
    const { id } = await params;
    const fallbackCourse = getFallbackCourseById(id);

    if (fallbackCourse) {
      return NextResponse.json({
        source: 'cached',
        warning: 'Neon is temporarily unavailable. Showing cached course details.',
        ...fallbackCourse,
      }, {
        headers: {
          'X-Certifind-Data-Source': 'cached',
        },
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch course', details: err.message },
      { status: 503 }
    );
  }
}
