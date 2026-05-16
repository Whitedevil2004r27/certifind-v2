import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { query } from '@/lib/db';
import { fallbackCourses } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

type DepartmentSummary = {
  name: string;
  count: number;
};

function getFallbackDepartments(): DepartmentSummary[] {
  const counts = new Map<string, number>();

  for (const course of fallbackCourses) {
    counts.set(course.department, (counts.get(course.department) || 0) + 1);
  }

  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function GET() {
  try {
    const getDepartments = unstable_cache(
      () => query<DepartmentSummary>(
        `
        SELECT department AS name, COUNT(*)::int AS count
        FROM courses
        WHERE department IS NOT NULL AND btrim(department) <> ''
        GROUP BY department
        ORDER BY count DESC, department ASC
        `
      ),
      ['departments:course-counts'],
      { revalidate: 300, tags: ['courses'] }
    );

    return NextResponse.json(await getDepartments(), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    console.error('Departments API using cached catalog:', err);
    return NextResponse.json(getFallbackDepartments(), {
      headers: {
        'X-Certifind-Data-Source': 'cached',
      },
    });
  }
}
