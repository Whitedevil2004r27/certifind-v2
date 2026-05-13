export type FallbackPlatform = {
  id: string;
  name: string;
  category: string;
  type: string;
  best_for: string;
  website_url: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
};

export type FallbackCourse = {
  course_id: string;
  title: string;
  description: string;
  instructor_name: string;
  platform: string;
  department: string;
  course_type: "Free" | "Paid";
  price: number;
  original_price: number | null;
  discount_percentage: number;
  rating: number;
  total_ratings: number;
  duration_hours: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  language: string;
  thumbnail_url: string;
  image_alt: string;
  course_url: string;
  last_updated: string;
  updated_at: string;
  tags: string[];
  is_bestseller: boolean;
  is_new: boolean;
  certificate_offered: boolean;
  scraped_at: string;
  platforms?: {
    name: string;
    category: string;
  };
};

const updatedAt = "2026-05-12T04:23:26.831Z";

export const fallbackPlatforms: FallbackPlatform[] = [
  {
    id: "b9322130-b60f-4bf0-b526-2b11411afd16",
    name: "Coursera",
    category: "Global",
    type: "Free + Paid",
    best_for: "University courses",
    website_url: "https://coursera.org",
    icon_name: "GraduationCap",
    is_active: true,
    created_at: updatedAt,
  },
  {
    id: "7341e7c3-a0a9-4dad-a2e6-0137dec10190",
    name: "Udemy",
    category: "Global",
    type: "Paid",
    best_for: "Skill-based courses",
    website_url: "https://udemy.com",
    icon_name: "BookOpen",
    is_active: true,
    created_at: updatedAt,
  },
  {
    id: "97f3c829-03c3-4f4b-8f3c-e6ddcfb825a0",
    name: "FutureLearn",
    category: "Global",
    type: "Free + Paid",
    best_for: "Short courses",
    website_url: "https://futurelearn.com",
    icon_name: "Globe",
    is_active: true,
    created_at: updatedAt,
  },
  {
    id: "0ca449f4-8e51-47ce-8e4e-be0cf5c6ce72",
    name: "LinkedIn Learning",
    category: "Global",
    type: "Free + Paid",
    best_for: "Professional development",
    website_url: "https://linkedin.com/learning",
    icon_name: "Linkedin",
    is_active: true,
    created_at: updatedAt,
  },
  {
    id: "050e9d6b-8ae8-4e00-970d-12ef8bcf0e38",
    name: "freeCodeCamp",
    category: "Tech & Development",
    type: "Free",
    best_for: "Web development",
    website_url: "https://freecodecamp.org",
    icon_name: "Code2",
    is_active: true,
    created_at: updatedAt,
  },
  {
    id: "b7a67244-a565-4df8-bbfe-9281c73987bf",
    name: "DataCamp",
    category: "Tech & Development",
    type: "Paid",
    best_for: "Data science",
    website_url: "https://datacamp.com",
    icon_name: "BarChart2",
    is_active: true,
    created_at: updatedAt,
  },
];

export const fallbackCourses: FallbackCourse[] = [
  {
    course_id: "6b2ff8b0-5444-4318-8e8a-50b7566974dd",
    title: "Python for Everybody",
    description: "A practical introduction to programming, data structures, and web data using Python.",
    instructor_name: "University of Michigan",
    platform: "Coursera",
    department: "Programming",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.5,
    total_ratings: 37681,
    duration_hours: 19.5,
    level: "Intermediate",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&sig=801",
    image_alt: "Learner working on a laptop during an online course",
    course_url: "https://www.coursera.org/specializations/python",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["python", "programming", "data"],
    is_bestseller: false,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "11c3cc92-ffff-4c86-9e0e-7f7a508ffe9e",
    title: "Introduction to Web Development",
    description: "Build modern responsive pages with HTML, CSS, JavaScript, and deployment basics.",
    instructor_name: "freeCodeCamp",
    platform: "freeCodeCamp",
    department: "Web Dev",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.6,
    total_ratings: 21542,
    duration_hours: 28,
    level: "Beginner",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800&sig=802",
    image_alt: "Code editor open on a laptop for web development",
    course_url: "https://www.freecodecamp.org/learn/",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["web", "html", "css", "javascript"],
    is_bestseller: true,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "d1964457-283f-4c10-989f-0b30dc266a16",
    title: "Data Structures and Algorithms",
    description: "Learn algorithmic thinking, complexity analysis, trees, graphs, and interview practice.",
    instructor_name: "UC San Diego",
    platform: "Coursera",
    department: "Computer Science",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.2,
    total_ratings: 18420,
    duration_hours: 34,
    level: "Intermediate",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800&sig=803",
    image_alt: "Developer studying algorithm code on a large monitor",
    course_url: "https://www.coursera.org/specializations/data-structures-algorithms",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["algorithms", "computer science"],
    is_bestseller: false,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "fe943fa8-4c71-41d5-b09e-018774f088b6",
    title: "Machine Learning Foundations",
    description: "Understand supervised learning, model evaluation, and practical ML workflows.",
    instructor_name: "DeepLearning.AI",
    platform: "Coursera",
    department: "Data Science",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.7,
    total_ratings: 29215,
    duration_hours: 32,
    level: "Intermediate",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&sig=804",
    image_alt: "Analytics dashboard visualizing machine learning results",
    course_url: "https://www.coursera.org/learn/machine-learning",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["machine learning", "ai", "data science"],
    is_bestseller: true,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "295e5f12-0267-4335-86ca-1e29d1338363",
    title: "Google Cybersecurity Certificate",
    description: "Prepare for entry-level cybersecurity work with security operations and risk concepts.",
    instructor_name: "Google",
    platform: "Coursera",
    department: "Network Security",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.7,
    total_ratings: 12415,
    duration_hours: 33,
    level: "Intermediate",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&sig=805",
    image_alt: "Cybersecurity analyst workstation with security visuals",
    course_url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["cybersecurity", "google", "security"],
    is_bestseller: false,
    is_new: true,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "9f96677d-c6fc-4721-aa21-c8ed04f70a1f",
    title: "Google Data Analytics Certificate",
    description: "Learn spreadsheets, SQL, dashboards, and analysis workflows for data roles.",
    instructor_name: "Google",
    platform: "Coursera",
    department: "Data Science Engineering",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.5,
    total_ratings: 22356,
    duration_hours: 31.7,
    level: "All Levels",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&sig=806",
    image_alt: "Business analytics charts on a laptop screen",
    course_url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["analytics", "data", "google"],
    is_bestseller: true,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "4fd18896-170a-4fc4-9be3-0fb036a941ba",
    title: "AWS Cloud Practitioner Essentials",
    description: "Learn core AWS cloud concepts, pricing, security, and architectural principles.",
    instructor_name: "AWS",
    platform: "Coursera",
    department: "AWS",
    course_type: "Free",
    price: 0,
    original_price: null,
    discount_percentage: 0,
    rating: 4.3,
    total_ratings: 25541,
    duration_hours: 12.9,
    level: "Beginner",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&sig=807",
    image_alt: "Cloud infrastructure visualization for AWS learning",
    course_url: "https://www.coursera.org/learn/aws-cloud-practitioner-essentials",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["aws", "cloud"],
    is_bestseller: true,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "c6f40870-bc31-468c-9133-c60f3d8fe2b1",
    title: "Advanced React and Next.js",
    description: "Build production-grade interfaces with routing, server rendering, and performance patterns.",
    instructor_name: "Vercel Learning",
    platform: "Udemy",
    department: "Web Dev",
    course_type: "Paid",
    price: 39.99,
    original_price: 129.99,
    discount_percentage: 69,
    rating: 4.8,
    total_ratings: 10544,
    duration_hours: 18.5,
    level: "Advanced",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800&sig=808",
    image_alt: "React interface development on a laptop",
    course_url: "https://www.udemy.com/",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["react", "next.js", "frontend"],
    is_bestseller: true,
    is_new: true,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "8f63d4f8-9d34-47b7-b372-898f2c34fb45",
    title: "SQL for Data Analysis",
    description: "Query relational data, aggregate business metrics, and optimize analytics workflows.",
    instructor_name: "DataCamp",
    platform: "DataCamp",
    department: "Data Science",
    course_type: "Paid",
    price: 25,
    original_price: 49,
    discount_percentage: 49,
    rating: 4.6,
    total_ratings: 8820,
    duration_hours: 10,
    level: "Beginner",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800&sig=809",
    image_alt: "Data tables and charts for SQL analysis",
    course_url: "https://www.datacamp.com/courses",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["sql", "analytics", "database"],
    is_bestseller: false,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "2e5ebda7-c8fa-4b0b-9724-119348bdcdb0",
    title: "Product Management Foundations",
    description: "Practice discovery, prioritization, roadmap planning, and metrics for SaaS products.",
    instructor_name: "LinkedIn Learning",
    platform: "LinkedIn Learning",
    department: "Business",
    course_type: "Paid",
    price: 19.99,
    original_price: 39.99,
    discount_percentage: 50,
    rating: 4.4,
    total_ratings: 6910,
    duration_hours: 8.5,
    level: "Beginner",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&sig=810",
    image_alt: "Product team planning a roadmap on a wall",
    course_url: "https://www.linkedin.com/learning/",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["product", "business", "saas"],
    is_bestseller: false,
    is_new: false,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
  {
    course_id: "77d68e2a-4c6a-4a55-9cfa-3b27e01f5e10",
    title: "Digital Marketing Strategy",
    description: "Plan multi-channel campaigns, measure conversion, and optimize growth funnels.",
    instructor_name: "FutureLearn",
    platform: "FutureLearn",
    department: "Marketing",
    course_type: "Paid",
    price: 29,
    original_price: 59,
    discount_percentage: 51,
    rating: 4.1,
    total_ratings: 5122,
    duration_hours: 9,
    level: "All Levels",
    language: "English",
    thumbnail_url: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=800&sig=811",
    image_alt: "Digital marketing planning with analytics screens",
    course_url: "https://www.futurelearn.com/courses",
    last_updated: "2026-05-10",
    updated_at: updatedAt,
    tags: ["marketing", "growth", "strategy"],
    is_bestseller: false,
    is_new: true,
    certificate_offered: true,
    scraped_at: updatedAt,
  },
];

const platformCategoryByName = new Map(fallbackPlatforms.map((platform) => [platform.name, platform.category]));

export function withFallbackPlatform(course: FallbackCourse) {
  return {
    ...course,
    platforms: {
      name: course.platform,
      category: platformCategoryByName.get(course.platform) || "Global",
    },
  };
}

function splitParam(value: string | null) {
  return value
    ? value.split(",").map((entry) => entry.trim()).filter(Boolean)
    : [];
}

export function getFallbackCourses(searchParams: URLSearchParams) {
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12", 10), 1), 48);
  const offset = (page - 1) * limit;
  const courseType = searchParams.get("course_type");
  const departments = splitParam(searchParams.get("department"));
  const platforms = splitParam(searchParams.get("platform"));
  const levels = splitParam(searchParams.get("level"));
  const minRating = Number(searchParams.get("min_rating") || 0);
  const maxDuration = Number(searchParams.get("max_duration") || 0);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const sortBy = searchParams.get("sort_by");

  let courses = fallbackCourses.filter((course) => {
    if (courseType && course.course_type !== courseType) return false;
    if (departments.length && !departments.includes(course.department)) return false;
    if (platforms.length && !platforms.includes(course.platform)) return false;
    if (levels.length && !levels.includes(course.level)) return false;
    if (minRating && course.rating < minRating) return false;
    if (maxDuration && course.duration_hours > maxDuration) return false;
    if (search) {
      const haystack = [course.title, course.instructor_name, course.platform, course.department, ...course.tags]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  courses = [...courses].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.total_ratings - a.total_ratings || Number(b.is_bestseller) - Number(a.is_bestseller);
    }
    if (sortBy === "newest" || sortBy === "updated") {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime() || Number(b.is_new) - Number(a.is_new);
    }
    return b.rating - a.rating || b.total_ratings - a.total_ratings;
  });

  const total = courses.length;
  const pageCourses = courses.slice(offset, offset + limit).map(withFallbackPlatform);

  return {
    courses: pageCourses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function getFallbackCourseById(id: string) {
  const course = fallbackCourses.find((entry) => entry.course_id === id);
  return course ? withFallbackPlatform(course) : null;
}

export function getFallbackLiveCourses(limit = 8) {
  return fallbackCourses
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit)
    .map(({ course_id, title, platform, course_type, rating, thumbnail_url, updated_at }) => ({
      course_id,
      title,
      platform,
      course_type,
      rating,
      thumbnail_url,
      updated_at,
    }));
}

export function getFallbackStats() {
  return {
    courses: fallbackCourses.length,
    platforms: fallbackPlatforms.length,
    activeUsers: 1250,
    topDepartments: new Set(fallbackCourses.map((course) => course.department)).size,
  };
}
