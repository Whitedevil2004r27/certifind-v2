import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackPlatforms } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const platforms = await query(
      'SELECT * FROM platforms WHERE is_active = true ORDER BY category, name'
    );

    return NextResponse.json(platforms);
  } catch (err: any) {
    console.error('Platforms API using cached catalog:', err);
    return NextResponse.json(fallbackPlatforms, {
      headers: {
        'X-Certifind-Data-Source': 'cached',
      },
    });
  }
}
