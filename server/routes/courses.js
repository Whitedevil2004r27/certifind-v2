const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/courses
// Query parameters supported: type (free|paid), search (keyword)
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    
    let query = supabase.from('courses').select('*');

    if (type === 'free') {
      query = query.eq('is_free', true);
    } else if (type === 'paid') {
      query = query.eq('is_free', false);
    }

    if (search) {
      // Search across title or category
      query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      throw error;
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
