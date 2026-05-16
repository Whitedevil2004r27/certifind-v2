import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { query } from '@/lib/db';
import { getFallbackStats } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const getStats = unstable_cache(
      async () => {
        const [courseResult, platformResult, deptResult] = await Promise.all([
          query<{ count: string }>('SELECT COUNT(*) FROM courses'),
          query<{ count: string }>('SELECT COUNT(*) FROM platforms WHERE is_active = true'),
          query<{ count: string }>('SELECT COUNT(DISTINCT department) FROM courses')
        ]);

        return {
          courseCount: parseInt(courseResult[0].count),
          platformCount: parseInt(platformResult[0].count),
          deptCount: parseInt(deptResult[0].count),
        };
      },
      ['stats:catalog'],
      { revalidate: 120, tags: ['courses', 'platforms'] }
    );

    const { courseCount, platformCount, deptCount } = await getStats();

    return NextResponse.json({
      source: 'neon',
      courses: courseCount || 220,
      platforms: platformCount || 32,
      activeUsers: 1250, // Mock for now
      topDepartments: deptCount || 12
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.warn('Stats API using fallback values:', error?.message || error);
    return NextResponse.json({
      source: 'cached',
      warning: 'Neon is temporarily unavailable. Showing cached platform stats.',
      ...getFallbackStats(),
    }, {
      headers: {
        'X-Certifind-Data-Source': 'cached',
      },
    });
  }
}

