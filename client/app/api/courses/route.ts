import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAppUser, isAdminUser } from '@/lib/current-user';
import { getFallbackCourses } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const course_type = searchParams.get('course_type');
    const departmentStr = searchParams.get('department');
    const platformStr = searchParams.get('platform');
    const levelStr = searchParams.get('level');
    
    const min_rating = searchParams.get('min_rating');
    const max_duration = searchParams.get('max_duration');
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by');

    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (course_type) {
      whereConditions.push(`course_type = $${paramIndex++}`);
      queryParams.push(course_type);
    }
    
    if (departmentStr) {
      const deps = departmentStr.split(',');
      const placeholders = deps.map(() => `$${paramIndex++}`).join(', ');
      whereConditions.push(`department IN (${placeholders})`);
      queryParams.push(...deps);
    }
    
    if (platformStr) {
      const plats = platformStr.split(',');
      const placeholders = plats.map(() => `$${paramIndex++}`).join(', ');
      whereConditions.push(`platform IN (${placeholders})`);
      queryParams.push(...plats);
    }
    
    if (levelStr) {
      const lvls = levelStr.split(',');
      const placeholders = lvls.map(() => `$${paramIndex++}`).join(', ');
      whereConditions.push(`level IN (${placeholders})`);
      queryParams.push(...lvls);
    }

    if (min_rating) {
      whereConditions.push(`rating >= $${paramIndex++}`);
      queryParams.push(parseFloat(min_rating));
    }
    if (max_duration) {
      whereConditions.push(`duration_hours <= $${paramIndex++}`);
      queryParams.push(parseFloat(max_duration));
    }

    if (search) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR instructor_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY rating DESC, total_ratings DESC';
    if (sort_by === 'newest') {
      orderBy = 'ORDER BY COALESCE(updated_at, scraped_at, last_updated::timestamptz) DESC, is_new DESC';
    } else if (sort_by === 'popularity') {
      orderBy = 'ORDER BY total_ratings DESC, is_bestseller DESC';
    } else if (sort_by === 'updated') {
      orderBy = 'ORDER BY COALESCE(updated_at, scraped_at, last_updated::timestamptz) DESC';
    }

    const countQuery = `SELECT COUNT(*) FROM courses ${whereClause}`;
    const dataQuery = `
      SELECT c.*, p.category as platform_category
      FROM courses c
      LEFT JOIN platforms p ON c.platform = p.name
      ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    const [countResult, dataResult] = await Promise.all([
      query<{ count: string }>(countQuery, queryParams),
      query(dataQuery, [...queryParams, limit, offset])
    ]);

    const totalCount = parseInt(countResult[0].count);

    const courses = dataResult.map((course: any) => ({
      ...course,
      platforms: {
        name: course.platform,
        category: course.platform_category || 'Global',
      },
    }));

    return NextResponse.json({
      source: 'neon',
      courses,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (err: any) {
    console.error('Courses API using cached catalog:', err);
    const { searchParams } = new URL(request.url);
    const fallback = getFallbackCourses(searchParams);

    return NextResponse.json({
      source: 'cached',
      warning: 'Neon is temporarily unavailable. Showing cached course catalog.',
      details: err.message,
      ...fallback,
    }, {
      headers: {
        'X-Certifind-Data-Source': 'cached',
      },
    });
  }
}

export async function POST(request: Request) {
  const user = await getAppUser();

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      platform,
      department,
      course_type,
      price,
      original_price,
      discount_percentage,
      rating,
      total_ratings,
      duration_hours,
      level,
      language,
      thumbnail_url,
      course_url,
      tags,
      is_bestseller,
      is_new,
      certificate_offered,
    } = body;

    if (!title || !platform || !department || !course_type || !course_url) {
      return NextResponse.json(
        { error: 'title, platform, department, course_type, and course_url are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `
      INSERT INTO courses (
        title, description, instructor_name, platform, department, course_type,
        price, original_price, discount_percentage, rating,
        total_ratings, duration_hours, level, language,
        thumbnail_url, course_url, tags, is_bestseller,
        is_new, certificate_offered
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
      `,
      [
        title,
        description || null,
        user?.name || 'Admin',
        platform,
        department,
        course_type,
        price || 0,
        original_price || null,
        discount_percentage || 0,
        rating || 0,
        total_ratings || 0,
        duration_hours || 0,
        level || 'All Levels',
        language || 'English',
        thumbnail_url || null,
        course_url,
        Array.isArray(tags) ? tags : [],
        Boolean(is_bestseller),
        Boolean(is_new),
        Boolean(certificate_offered),
      ]
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (err: any) {
    console.error('Create course API error:', err);
    return NextResponse.json(
      { error: 'Failed to create course', details: err.message },
      { status: 500 }
    );
  }
}

