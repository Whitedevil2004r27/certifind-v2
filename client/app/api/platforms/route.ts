import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { query } from '@/lib/db';
import { fallbackPlatforms } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const getPlatforms = unstable_cache(
      () => query(
        `
        SELECT id, name, category, type, best_for, website_url, icon_name
        FROM platforms
        WHERE is_active = true
        ORDER BY category, name
        `
      ),
      ['platforms:active'],
      { revalidate: 300, tags: ['platforms'] }
    );

    return NextResponse.json(await getPlatforms(), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    console.error('Platforms API using cached catalog:', err);
    return NextResponse.json(fallbackPlatforms, {
      headers: {
        'X-Certifind-Data-Source': 'cached',
      },
    });
  }
}
