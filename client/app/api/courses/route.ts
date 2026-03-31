import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase.from('courses').select('*, platforms(*)', { count: 'exact' });

    // 1. Exact Match Filters
    if (course_type) query = query.eq('course_type', course_type);
    
    if (departmentStr) {
      const deps = departmentStr.split(',');
      if (deps.length > 1) query = query.in('department', deps);
      else query = query.eq('department', deps[0]);
    }
    
    if (platformStr) {
      const plats = platformStr.split(',');
      if (plats.length > 1) query = query.in('platform', plats);
      else query = query.eq('platform', plats[0]);
    }
    
    if (levelStr) {
      const lvls = levelStr.split(',');
      if (lvls.length > 1) query = query.in('level', lvls);
      else query = query.eq('level', lvls[0]);
    }

    // 2. Numeric Range Filters
    if (min_rating) query = query.gte('rating', parseFloat(min_rating));
    if (max_duration) query = query.lte('duration_hours', parseFloat(max_duration));

    // 3. Search Bar Integration
    if (search) {
      query = query.or(`title.ilike.%${search}%,instructor_name.ilike.%${search}%`);
    }

    // 4. Advanced Sorting Parameters
    if (sort_by === 'newest') {
      query = query.order('last_updated', { ascending: false });
      query = query.order('is_new', { ascending: false });
    } else if (sort_by === 'popularity') {
      query = query.order('total_ratings', { ascending: false });
      query = query.order('is_bestseller', { ascending: false });
    } else {
      // Default to highest rating
      query = query.order('rating', { ascending: false });
    }

    // 5. Apply Pagination Pipeline
    const { data, error, count } = await query.range(start, end);
    
    if (error) {
      console.error('Supabase Query Error:', error);
      // Fallback: try without the join if the join failed due to RLS/Schema
      if (error.message.includes('relation') || error.message.includes('platforms')) {
        console.log('Retrying without platforms join...');
        const fallbackQuery = supabase.from('courses').select('*', { count: 'exact' });
        const { data: fData, error: fError, count: fCount } = await fallbackQuery.range(start, end);
        if (fError) throw fError;
        
        return NextResponse.json({
          courses: fData,
          pagination: { total: fCount, page, limit, totalPages: Math.ceil((fCount || 0) / limit) }
        });
      }
      throw error;
    }

    return NextResponse.json({
      courses: data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (err: any) {
    console.error('CRITICAL API ERROR [/api/courses]:', err);
    return NextResponse.json({ 
      error: 'Failed to fetch courses', 
      details: err.message,
      hint: 'Check if platforms table RLS is enabled and select policy exists.'
    }, { status: 500 });
  }
}
