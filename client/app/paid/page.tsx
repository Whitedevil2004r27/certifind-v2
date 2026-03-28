"use client";

import { useEffect, useState } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { Loader2 } from "lucide-react";

export default function PaidCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses?type=paid");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Failed to load courses:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          <span className="text-yellow-500">Premium</span> Courses
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl">
          Invest in your future. Browse highly-rated paid courses curated for serious professionals.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      )}
    </div>
  );
}
