const express = require('express');
const router = express.Router();
const sql = require('../db');

// GET /api/bookmarks?userId=<uuid>
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const bookmarks = await sql.query(`
      SELECT c.* 
      FROM bookmarks b
      JOIN courses c ON b.course_id = c.course_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);
    return res.status(200).json(bookmarks);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST /api/bookmarks — toggle (insert if missing, delete if exists)
router.post('/', async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId are required' });
  }

  try {
    const existing = await sql.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existing.length > 0) {
      await sql.query(
        'DELETE FROM bookmarks WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );
      return res.status(200).json({ isBookmarked: false });
    } else {
      await sql.query(
        'INSERT INTO bookmarks (user_id, course_id) VALUES ($1, $2)',
        [userId, courseId]
      );
      return res.status(201).json({ isBookmarked: true });
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    return res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// DELETE /api/bookmarks — explicitly remove a bookmark
router.delete('/', async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId are required' });
  }

  try {
    await sql.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting bookmark:', err);
    return res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router;
