const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/courses
// Advanced Faceted Endpoint
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, limit = 12,
      course_type,
      department,
      platform,
      level,
      min_rating,
      max_duration,
      search,
      sort_by
    } = req.query;
    
    // Calculate range for pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase.from('courses').select('*', { count: 'exact' });

    // 1. Exact Match Filters
    if (course_type) query = query.eq('course_type', course_type);
    
    if (department) {
      if (Array.isArray(department)) query = query.in('department', department);
      else query = query.eq('department', department);
    }
    
    if (platform) {
      if (Array.isArray(platform)) query = query.in('platform', platform);
      else query = query.eq('platform', platform);
    }
    
    if (level) {
      if (Array.isArray(level)) query = query.in('level', level);
      else query = query.eq('level', level);
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
      // Default mapping to highest rating
      query = query.order('rating', { ascending: false });
    }

    // 5. Apply Pagination Pipeline
    const { data, error, count } = await query.range(start, end);
    
    if (error) throw error;

    return res.status(200).json({
      courses: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
