import RealtimeCourseModule from "@/components/courses/RealtimeCourseModule";

export default function LiveCoursesPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[1500px]">
        <RealtimeCourseModule variant="public" />
      </div>
    </main>
  );
}
