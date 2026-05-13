const express = require('express');
const router = express.Router();
const sql = require('../db');

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
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const pageSize = parseInt(limit);

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // 1. Exact Match Filters
    if (course_type) {
      whereConditions.push(`course_type = $${paramIndex++}`);
      queryParams.push(course_type);
    }
    
    if (department) {
      if (Array.isArray(department)) {
        const placeholders = department.map(() => `$${paramIndex++}`).join(', ');
        whereConditions.push(`department IN (${placeholders})`);
        queryParams.push(...department);
      } else {
        whereConditions.push(`department = $${paramIndex++}`);
        queryParams.push(department);
      }
    }
    
    if (platform) {
      if (Array.isArray(platform)) {
        const placeholders = platform.map(() => `$${paramIndex++}`).join(', ');
        whereConditions.push(`platform IN (${placeholders})`);
        queryParams.push(...platform);
      } else {
        whereConditions.push(`platform = $${paramIndex++}`);
        queryParams.push(platform);
      }
    }
    
    if (level) {
      if (Array.isArray(level)) {
        const placeholders = level.map(() => `$${paramIndex++}`).join(', ');
        whereConditions.push(`level IN (${placeholders})`);
        queryParams.push(...level);
      } else {
        whereConditions.push(`level = $${paramIndex++}`);
        queryParams.push(level);
      }
    }

    // 2. Numeric Range Filters
    if (min_rating) {
      whereConditions.push(`rating >= $${paramIndex++}`);
      queryParams.push(parseFloat(min_rating));
    }
    if (max_duration) {
      whereConditions.push(`duration_hours <= $${paramIndex++}`);
      queryParams.push(parseFloat(max_duration));
    }

    // 3. Search Bar Integration
    if (search) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR instructor_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 4. Advanced Sorting
    let orderBy = 'ORDER BY rating DESC';
    if (sort_by === 'newest') {
      orderBy = 'ORDER BY last_updated DESC, is_new DESC';
    } else if (sort_by === 'popularity') {
      orderBy = 'ORDER BY total_ratings DESC, is_bestseller DESC';
    }

    // 5. Execute Queries
    const countQuery = `SELECT COUNT(*) FROM courses ${whereClause}`;
    const dataQuery = `SELECT * FROM courses ${whereClause} ${orderBy} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    
    const [countResult, dataResult] = await Promise.all([
      sql.query(countQuery, queryParams),
      sql.query(dataQuery, [...queryParams, pageSize, offset])
    ]);

    const totalCount = parseInt(countResult[0].count);

    return res.status(200).json({
      courses: dataResult,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query(`
      SELECT c.*, p.category as platform_category
      FROM courses c
      LEFT JOIN platforms p ON c.platform = p.name
      WHERE c.course_id = $1
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = result[0];
    // Map platform_category back to nested object for frontend compatibility
    course.platforms = { category: course.platform_category };
    
    return res.status(200).json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses (Admin only)
router.post('/', async (req, res) => {
  try {
    const { 
      title, description, platform, department, course_type, 
      price, original_price, discount_percentage, rating, 
      total_ratings, duration_hours, level, language, 
      thumbnail_url, course_url, tags, is_bestseller, 
      is_new, certificate_offered 
    } = req.body;

    const result = await sql.query(`
      INSERT INTO courses (
        title, description, instructor_name, platform, department, course_type, 
        price, original_price, discount_percentage, rating, 
        total_ratings, duration_hours, level, language, 
        thumbnail_url, course_url, tags, is_bestseller, 
        is_new, certificate_offered
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `, [
      title, description, 'Admin', platform, department, course_type, 
      price || 0, original_price || null, discount_percentage || 0, rating || 0.0, 
      total_ratings || 0, duration_hours || 0, level || 'All Levels', language || 'English', 
      thumbnail_url, course_url, tags || [], is_bestseller || false, 
      is_new || false, certificate_offered || false
    ]);

    return res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error creating course:', err);
    return res.status(500).json({ error: 'Failed to create course' });
  }
});

module.exports = router;

