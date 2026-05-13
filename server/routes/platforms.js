const express = require('express');
const router = express.Router();
const sql = require('../db');

// GET /api/platforms
router.get('/', async (req, res) => {
  try {
    const platforms = await sql.query('SELECT * FROM platforms ORDER BY category, name');
    return res.status(200).json(platforms);
  } catch (err) {
    console.error('Error fetching platforms:', err);
    return res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

module.exports = router;
