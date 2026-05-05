const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranZkbGFvY2l5ZXlxd2FscXFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDY4ODI1MSwiZXhwIjoyMDkwMjY0MjUxfQ.ipgnkKvBQHYdEYiYSaP4xuCLjTdJqNCT1afBWsTKgHI';

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Mobile App Development', 'UI/UX Design', 'DevOps', 'Blockchain', 'Game Development'];
const platforms = ['Udemy', 'Coursera', 'Pluralsight', 'LinkedIn Learning', 'edX'];
const prices = ['$19.99', '$29.99', '$49.99', '$89.99', '$199.00', '$9.99/mo', '$29.00/mo'];

const adjectives = ['Complete', 'Ultimate', 'Advanced', 'Beginner to Advanced', 'Masterclass', 'Bootcamp', 'Professional', 'Accelerated', 'Hands-on', 'Practical'];
const subjects = ['React', 'Python', 'JavaScript', 'AWS', 'Docker', 'Kubernetes', 'Node.js', 'Machine Learning', 'SQL', 'TypeScript', 'Angular', 'Vue.js', 'Go', 'Rust', 'C++', 'Java', 'Flutter', 'iOS Swift', 'Android Kotlin'];

const generateCourses = (count) => {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const price = prices[Math.floor(Math.random() * prices.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const title = `The ${adjective} ${subject} Certification Course 2026`;
    const description = `Learn ${subject} from scratch to advanced level. This comprehensive course covers everything you need to know to become a high-paying professional. Gain mastery over ${category} through practical, hands-on projects and real-world scenarios.`;
    const rating = (Math.random() * (5.0 - 4.1) + 4.1).toFixed(1); // 4.1 to 5.0
    const themeIndex = Math.floor(Math.random() * 8) + 1; // 1 to 8 
    const thumbnail = `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/800/450`;
    
    courses.push({
      title,
      description,
      platform,
      department: category, // Matches schema
      course_type: 'Paid', // Matches schema
      price: parseFloat(price.replace('$', '').replace('/mo', '')), // Numeric
      rating: parseFloat(rating),
      thumbnail_url: thumbnail, // Matches schema
      course_url: 'https://example.com/course/' + Math.floor(Math.random() * 1000000),
      level: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'][Math.floor(Math.random() * 4)],
      instructor_name: 'CertiFind Expert',
      is_new: Math.random() > 0.8,
      is_bestseller: Math.random() > 0.8
    });
  }
  return courses;
};

async function seed() {
  console.log('Generating 105 mock paid courses...');
  const courses = generateCourses(105);
  
  // To avoid hitting payload size limits, insert in batches
  const batchSize = 25;
  let insertedCount = 0;

  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize);
    console.log(`Inserting batch ${i/batchSize + 1}...`);
    const { data, error } = await supabase.from('courses').insert(batch);
    
    if (error) {
      console.error('Error inserting batch:', error.message);
      return;
    }
    insertedCount += batch.length;
  }
  
  console.log(`Successfully seeded ${insertedCount} paid courses into the database!`);
}

seed();
