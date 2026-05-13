import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getFallbackStats } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [courseResult, platformResult, deptResult] = await Promise.all([
      query<{ count: string }>('SELECT COUNT(*) FROM courses'),
      query<{ count: string }>('SELECT COUNT(*) FROM platforms'),
      query<{ count: string }>('SELECT COUNT(DISTINCT department) FROM courses')
    ]);

    const courseCount = parseInt(courseResult[0].count);
    const platformCount = parseInt(platformResult[0].count);
    const deptCount = parseInt(deptResult[0].count);

    return NextResponse.json({
      source: 'neon',
      courses: courseCount || 220,
      platforms: platformCount || 32,
      activeUsers: 1250, // Mock for now
      topDepartments: deptCount || 12
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

