require('dotenv').config();
const express = require('express');
const cors = require('cors');

const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main App Routes
app.use('/api/courses', coursesRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CertiFind API is running perfectly.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
