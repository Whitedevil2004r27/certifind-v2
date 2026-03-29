const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/courses
// Query parameters supported: type (free|paid), search (keyword)
router.get('/', async (req, res) => {
  try {
    const { type, search, category, page = 1, limit = 12 } = req.query;
    
    // Calculate range for pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase.from('courses').select('*', { count: 'exact' });

    if (type === 'free') {
      query = query.eq('is_free', true);
    } else if (type === 'paid') {
      query = query.eq('is_free', false);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      // Search across title only if category is explicitly set
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const { data, error, count } = await query
      .order('rating', { ascending: false })
      .range(start, end);
    
    if (error) {
      throw error;
    }

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
