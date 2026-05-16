import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("DATABASE_URL or POSTGRES_URL is required to seed Neon.");
  process.exit(1);
}

const requestedCount = Number.parseInt(
  process.argv.find((arg) => arg.startsWith("--count="))?.split("=")[1] || "1200",
  10
);
const totalCourses = Number.isFinite(requestedCount) ? Math.max(1000, requestedCount) : 1200;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 4,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const fallbackPlatforms = [
  "Coursera",
  "Udemy",
  "edX",
  "FutureLearn",
  "LinkedIn Learning",
  "DataCamp",
  "Pluralsight",
  "freeCodeCamp",
  "NPTEL",
  "Skillshare",
];

const departments = [
  {
    name: "Frontend Development",
    topics: ["React", "Next.js", "TypeScript", "Design Systems", "Web Performance", "Tailwind CSS"],
    color: "271245",
    accent: "f8f2ff",
  },
  {
    name: "Backend Engineering",
    topics: ["Node.js", "API Design", "PostgreSQL", "Microservices", "Authentication", "System Design"],
    color: "102033",
    accent: "e8f7ff",
  },
  {
    name: "Data Analytics",
    topics: ["SQL Analytics", "Power BI", "Tableau", "Statistics", "Data Storytelling", "Excel Modeling"],
    color: "13251f",
    accent: "ebfff8",
  },
  {
    name: "Artificial Intelligence",
    topics: ["Machine Learning", "Prompt Engineering", "LLM Apps", "Computer Vision", "MLOps", "AI Product Strategy"],
    color: "241433",
    accent: "fbf0ff",
  },
  {
    name: "Cloud & DevOps",
    topics: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    color: "111b35",
    accent: "edf4ff",
  },
  {
    name: "Cybersecurity",
    topics: ["Network Security", "SOC Analysis", "Ethical Hacking", "Cloud Security", "Risk Management", "Identity Security"],
    color: "251515",
    accent: "fff1ed",
  },
  {
    name: "Product & UX",
    topics: ["UX Research", "Product Management", "Figma", "Growth Strategy", "Design Thinking", "User Testing"],
    color: "261735",
    accent: "fff0fb",
  },
  {
    name: "Business & Marketing",
    topics: ["Digital Marketing", "SEO", "Brand Strategy", "Sales Operations", "Finance Basics", "Analytics for Business"],
    color: "2b2110",
    accent: "fff8e6",
  },
  {
    name: "Mobile Development",
    topics: ["React Native", "Flutter", "Android", "iOS", "Mobile UX", "App Store Launch"],
    color: "0f2730",
    accent: "e9fbff",
  },
  {
    name: "Career Certification",
    topics: ["Resume Strategy", "Interview Prep", "Portfolio Projects", "Agile", "Leadership", "Communication"],
    color: "201733",
    accent: "f5f1ff",
  },
];

const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const titleFormats = [
  "{topic} Professional Certificate",
  "Complete {topic} Bootcamp",
  "{topic} for SaaS Teams",
  "Applied {topic} Projects",
  "{topic} Career Accelerator",
  "Modern {topic} Masterclass",
  "{topic} Foundations to Portfolio",
  "Production-Ready {topic}",
];
const outcomes = [
  "Build portfolio-ready projects, understand industry workflows, and prepare for practical certification outcomes.",
  "Learn through concise lessons, guided labs, and capstone tasks designed for modern SaaS product teams.",
  "Turn core concepts into job-ready proof with structured practice, assessments, and real-world scenarios.",
  "Move from fundamentals to applied execution with clear milestones, templates, and measurable learning outcomes.",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashNumber(value) {
  return Number.parseInt(crypto.createHash("sha256").update(value).digest("hex").slice(0, 8), 16);
}

function getDepartmentVisual(departmentName) {
  const existing = departments.find((department) => department.name === departmentName);
  if (existing) return existing;

  const fallback = departments[hashNumber(departmentName || "career-skills") % departments.length];
  return {
    name: departmentName || "Career Skills",
    color: fallback.color,
    accent: fallback.accent,
  };
}

function deterministicUuid(input) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0") + hash.slice(18, 20),
    hash.slice(20, 32),
  ].join("-");
}

function platformSearchUrl(platform, title, index) {
  const query = encodeURIComponent(title);
  const tracking = `certifind=${String(index + 1).padStart(4, "0")}`;
  const urls = {
    Coursera: `https://www.coursera.org/search?query=${query}&${tracking}`,
    Udemy: `https://www.udemy.com/courses/search/?q=${query}&${tracking}`,
    edX: `https://www.edx.org/search?q=${query}&${tracking}`,
    FutureLearn: `https://www.futurelearn.com/search?q=${query}&${tracking}`,
    "LinkedIn Learning": `https://www.linkedin.com/learning/search?keywords=${query}&${tracking}`,
    DataCamp: `https://www.datacamp.com/search?q=${query}&${tracking}`,
    Pluralsight: `https://www.pluralsight.com/search?q=${query}&${tracking}`,
    freeCodeCamp: `https://www.freecodecamp.org/news/search/?query=${query}&${tracking}`,
    NPTEL: `https://nptel.ac.in/courses?search=${query}&${tracking}`,
    Skillshare: `https://www.skillshare.com/en/search?query=${query}&${tracking}`,
  };

  return urls[platform] || `https://www.google.com/search?q=${query}+course&${tracking}`;
}

function buildThumbnailUrl(title, department, index, uniqueKey = "") {
  const sequence = String(index + 1).padStart(4, "0");
  const label = encodeURIComponent(`CF-${sequence}\n${department.name}\n${title}`.slice(0, 110));
  const bg = department.color;
  const fg = department.accent;
  const version = encodeURIComponent(slugify(uniqueKey || `${title}-${sequence}`) || sequence);
  return `https://placehold.co/800x450/${bg}/${fg}.webp?font=montserrat&text=${label}&v=${version}`;
}

async function getPlatformNames() {
  const result = await pool.query("SELECT name FROM platforms WHERE is_active = true ORDER BY name");
  return result.rows.map((row) => row.name).filter(Boolean);
}

function generateCourses(platforms) {
  const courses = [];
  const thumbnailUrls = new Set();
  const platformNames = platforms.length ? platforms : fallbackPlatforms;

  for (let index = 0; index < totalCourses; index += 1) {
    const department = departments[index % departments.length];
    const topic = department.topics[Math.floor(index / departments.length) % department.topics.length];
    const format = titleFormats[Math.floor(index / (departments.length * department.topics.length)) % titleFormats.length];
    const title = `${format.replace("{topic}", topic)} ${String(index + 1).padStart(4, "0")}`;
    const platform = platformNames[index % platformNames.length];
    const level = levels[index % levels.length];
    const courseType = index % 5 === 0 || platform === "freeCodeCamp" || platform === "NPTEL" ? "Free" : "Paid";
    const certificateOffered = courseType === "Paid" || index % 3 === 0;
    const price = courseType === "Free" ? 0 : 19 + (index % 9) * 10;
    const originalPrice = courseType === "Free" ? null : price + 40 + (index % 5) * 15;
    const discountPercentage = courseType === "Free" ? 0 : Math.round(((originalPrice - price) / originalPrice) * 100);
    const courseId = deterministicUuid(`certifind-large-course-${index + 1}`);
    const thumbnailUrl = buildThumbnailUrl(title, department, index, courseId);

    if (thumbnailUrls.has(thumbnailUrl)) {
      throw new Error(`Duplicate thumbnail URL generated: ${thumbnailUrl}`);
    }
    thumbnailUrls.add(thumbnailUrl);

    courses.push({
      course_id: courseId,
      title,
      description: `${outcomes[index % outcomes.length]} Focus area: ${topic}. Category: ${department.name}.`,
      instructor_name: `${platform} Learning Lab`,
      platform,
      department: department.name,
      course_type: courseType,
      price,
      original_price: originalPrice,
      discount_percentage: discountPercentage,
      rating: Number((4.1 + (index % 10) * 0.08).toFixed(1)),
      total_ratings: 250 + ((index * 137) % 95000),
      duration_hours: Number((2.5 + (index % 36) * 0.75).toFixed(1)),
      level,
      language: "English",
      thumbnail_url: thumbnailUrl,
      image_alt: `${title} course thumbnail for ${department.name}`,
      course_url: platformSearchUrl(platform, title, index),
      tags: [topic, department.name, level, certificateOffered ? "certificate" : "audit", courseType.toLowerCase()],
      is_bestseller: index % 17 === 0,
      is_new: index < 96,
      certificate_offered: certificateOffered,
    });
  }

  return courses;
}

async function ensurePerformanceIndexes() {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_thumbnail_url_unique ON courses(thumbnail_url) WHERE thumbnail_url IS NOT NULL");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_courses_department_type_rating ON courses(department, course_type, rating DESC)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_courses_platform_rating ON courses(platform, rating DESC)");
}

async function backfillExistingCourseMetadata() {
  await pool.query(`
    UPDATE courses
    SET description = CONCAT(
      'A curated ', department, ' course from ', platform,
      ' with practical lessons, guided practice, and career-ready learning outcomes.'
    )
    WHERE description IS NULL OR btrim(description) = ''
  `);

  await pool.query(`
    UPDATE courses
    SET image_alt = CONCAT(title, ' course thumbnail for ', department)
    WHERE image_alt IS NULL OR btrim(image_alt) = ''
  `);
}

async function normalizeCourseImages() {
  const result = await pool.query(`
    SELECT course_id, title, department
    FROM courses
    ORDER BY COALESCE(updated_at, scraped_at, last_updated::timestamptz) DESC NULLS LAST, title, course_id
  `);

  const seenUrls = new Set();
  const updates = [];

  for (const [index, course] of result.rows.entries()) {
    const department = getDepartmentVisual(course.department);
    const thumbnailUrl = buildThumbnailUrl(course.title, department, index, course.course_id);

    if (seenUrls.has(thumbnailUrl)) {
      throw new Error(`Duplicate normalized thumbnail URL generated: ${thumbnailUrl}`);
    }
    seenUrls.add(thumbnailUrl);

    updates.push({
      thumbnail_url: thumbnailUrl,
      image_alt: `${course.title} course thumbnail for ${department.name}`,
      course_id: course.course_id,
    });
  }

  const batchSize = 100;
  for (let start = 0; start < updates.length; start += batchSize) {
    const batch = updates.slice(start, start + batchSize);
    const values = [];
    const placeholders = batch.map((course, rowIndex) => {
      const offset = rowIndex * 3;
      values.push(course.thumbnail_url, course.image_alt, course.course_id);
      return `($${offset + 1}::text, $${offset + 2}::text, $${offset + 3}::uuid)`;
    });

    await pool.query(
      `
      UPDATE courses c
      SET
        thumbnail_url = v.thumbnail_url,
        image_alt = v.image_alt,
        updated_at = COALESCE(c.updated_at, now())
      FROM (VALUES ${placeholders.join(", ")}) AS v(thumbnail_url, image_alt, course_id)
      WHERE c.course_id = v.course_id
      `,
      values
    );
  }
}

async function upsertCourses(courses) {
  const batchSize = 100;
  let upserted = 0;

  for (let start = 0; start < courses.length; start += batchSize) {
    const batch = courses.slice(start, start + batchSize);
    const values = [];
    const placeholders = batch.map((course, rowIndex) => {
      const offset = rowIndex * 24;
      values.push(
        course.course_id,
        course.title,
        course.description,
        course.instructor_name,
        course.platform,
        course.department,
        course.course_type,
        course.price,
        course.original_price,
        course.discount_percentage,
        course.rating,
        course.total_ratings,
        course.duration_hours,
        course.level,
        course.language,
        course.thumbnail_url,
        course.image_alt,
        course.course_url,
        course.tags,
        course.is_bestseller,
        course.is_new,
        course.certificate_offered,
        new Date(),
        new Date()
      );

      return `(${Array.from({ length: 24 }, (_, columnIndex) => `$${offset + columnIndex + 1}`).join(", ")})`;
    });

    await pool.query(
      `
      INSERT INTO courses (
        course_id, title, description, instructor_name, platform, department,
        course_type, price, original_price, discount_percentage, rating,
        total_ratings, duration_hours, level, language, thumbnail_url,
        image_alt, course_url, tags, is_bestseller, is_new,
        certificate_offered, scraped_at, updated_at
      )
      VALUES ${placeholders.join(", ")}
      ON CONFLICT (course_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructor_name = EXCLUDED.instructor_name,
        platform = EXCLUDED.platform,
        department = EXCLUDED.department,
        course_type = EXCLUDED.course_type,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        discount_percentage = EXCLUDED.discount_percentage,
        rating = EXCLUDED.rating,
        total_ratings = EXCLUDED.total_ratings,
        duration_hours = EXCLUDED.duration_hours,
        level = EXCLUDED.level,
        language = EXCLUDED.language,
        thumbnail_url = EXCLUDED.thumbnail_url,
        image_alt = EXCLUDED.image_alt,
        course_url = EXCLUDED.course_url,
        tags = EXCLUDED.tags,
        is_bestseller = EXCLUDED.is_bestseller,
        is_new = EXCLUDED.is_new,
        certificate_offered = EXCLUDED.certificate_offered,
        updated_at = now()
      `,
      values
    );

    upserted += batch.length;
    process.stdout.write(`\rUpserted ${upserted}/${courses.length} courses`);
  }

  process.stdout.write("\n");
}

async function main() {
  await ensurePerformanceIndexes();
  const platforms = await getPlatformNames();
  const courses = generateCourses(platforms);
  await upsertCourses(courses);
  await backfillExistingCourseMetadata();
  await normalizeCourseImages();

  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(thumbnail_url)::int AS thumbnails,
      COUNT(DISTINCT thumbnail_url)::int AS unique_thumbnails,
      COUNT(*) FILTER (WHERE certificate_offered)::int AS certificate_courses,
      COUNT(*) FILTER (WHERE course_type = 'Free')::int AS free_courses,
      COUNT(*) FILTER (WHERE course_type = 'Paid')::int AS paid_courses
    FROM courses
  `);

  console.log(JSON.stringify(result.rows[0], null, 2));
}

main()
  .catch((error) => {
    console.error("\nSeed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
