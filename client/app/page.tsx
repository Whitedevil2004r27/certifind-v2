"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ChevronDown,
  CirclePlay,
  Compass,
  GraduationCap,
  Layers3,
  Loader2,
  Orbit,
  Search,
  Zap,
} from "lucide-react";
import CourseCard, { Course } from "@/components/CourseCard";
import StatsCounter from "@/components/StatsCounter";

const DEPARTMENTS = [
  { label: "All", value: "All" },
  { label: "Computer Science", value: "Computer Science Engineering" },
  { label: "Web Development", value: "Web Development" },
  { label: "Data Science", value: "Data Science Engineering" },
  { label: "AI & Machine Learning", value: "AI & Machine Learning" },
  { label: "Cloud & AWS", value: "AWS" },
  { label: "Ethical Hacking", value: "Ethical Hacking" },
  { label: "Mobile Development", value: "Mobile Development" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "DevOps", value: "DevOps" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Agricultural Technology", value: "Agricultural Technology" },
  { label: "Clinical Research", value: "Clinical Research" },
  { label: "Business & Management", value: "Business & Management" },
  { label: "Cybersecurity", value: "Cybersecurity" },
];

const INITIAL_LIMIT = 8;
const LOAD_MORE_LIMIT = 8;
const FRAME_COUNT = 5;
const sequenceFrames = [
  {
    label: "Enter course orbit",
    title: "A learner enters the field.",
    body: "Search intent becomes a visible path through disciplines, platforms, and credential options.",
  },
  {
    label: "Courses resolve",
    title: "Relevant courses move forward.",
    body: "Free and premium tracks separate into clear routes instead of a scattered list of links.",
  },
  {
    label: "Platforms align",
    title: "Every platform finds its orbit.",
    body: "Coursera, Udemy, LinkedIn Learning, Harvard Online, and more sit inside one discovery plane.",
  },
  {
    label: "Path ignites",
    title: "Career direction becomes momentum.",
    body: "The page shifts from browsing to a sequence of decisions that can actually be followed.",
  },
  {
    label: "Certification gateway",
    title: "The next credential is in view.",
    body: "Save, compare, and open the source course when the route feels right.",
  },
];

const platformSignals = [
  { name: "Coursera", tone: "text-cyan-200", offset: "lg:translate-y-8" },
  { name: "Udemy", tone: "text-emerald-200", offset: "lg:-translate-y-5" },
  { name: "LinkedIn Learning", tone: "text-sky-200", offset: "lg:translate-y-12" },
  { name: "Harvard Online", tone: "text-amber-200", offset: "lg:-translate-y-2" },
];

export default function HomePage() {
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [paidCourses, setPaidCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [freeLimit, setFreeLimit] = useState(INITIAL_LIMIT);
  const [paidLimit, setPaidLimit] = useState(INITIAL_LIMIT);
  const [totalFree, setTotalFree] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loadingMore, setLoadingMore] = useState<"free" | "paid" | null>(null);
  const [frameProgress, setFrameProgress] = useState(0);
  const sequenceRef = useRef<HTMLElement | null>(null);
  const [stats, setStats] = useState({
    courses: 44,
    platforms: 32,
    activeUsers: 1250,
    topDepartments: 12,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch((err) => console.error("Stats fetch failed:", err));
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const section = sequenceRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / travel));
      setFrameProgress(nextProgress);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const activeFrame = Math.min(
    FRAME_COUNT - 1,
    Math.max(0, Math.round(frameProgress * (FRAME_COUNT - 1)))
  );

  const spritePosition = useMemo(() => {
    if (FRAME_COUNT <= 1) return "0% center";
    return `${(activeFrame / (FRAME_COUNT - 1)) * 100}% center`;
  }, [activeFrame]);

  const fetchCourses = useCallback(
    async (
      currentSearch: string,
      currentCategory: string,
      fLimit: number,
      pLimit: number,
      isLoadMore = false
    ) => {
      if (!isLoadMore) setLoading(true);

      try {
        let baseUrl = `/api/courses?`;
        if (currentSearch) baseUrl += `search=${encodeURIComponent(currentSearch)}&`;
        if (currentCategory !== "All") {
          baseUrl += `department=${encodeURIComponent(currentCategory)}&`;
        }

        const [freeRes, paidRes] = await Promise.all([
          fetch(`${baseUrl}limit=${fLimit}&course_type=Free`),
          fetch(`${baseUrl}limit=${pLimit}&course_type=Paid`),
        ]);

        const [freeData, paidData] = await Promise.all([freeRes.json(), paidRes.json()]);

        setFreeCourses(freeData.courses || []);
        setPaidCourses(paidData.courses || []);
        setTotalFree(freeData.pagination?.total || 0);
        setTotalPaid(paidData.pagination?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(null);
      }
    },
    []
  );

  useEffect(() => {
    setFreeLimit(INITIAL_LIMIT);
    setPaidLimit(INITIAL_LIMIT);
    const timer = setTimeout(() => {
      fetchCourses(search, category, INITIAL_LIMIT, INITIAL_LIMIT);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, category, fetchCourses]);

  const handleLoadMore = (type: "free" | "paid") => {
    setLoadingMore(type);
    if (type === "free") {
      const newLimit = freeLimit + LOAD_MORE_LIMIT;
      setFreeLimit(newLimit);
      fetchCourses(search, category, newLimit, paidLimit, true);
    } else {
      const newLimit = paidLimit + LOAD_MORE_LIMIT;
      setPaidLimit(newLimit);
      fetchCourses(search, category, freeLimit, newLimit, true);
    }
  };

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pb-20 md:min-h-[calc(100vh-5rem)] lg:pt-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-[28%_center] opacity-70 sm:bg-center"
          style={{ backgroundImage: "url('/cinematic/course-journey-sequence.png')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#03060b_0%,rgba(3,6,11,0.86)_28%,rgba(3,6,11,0.54)_55%,rgba(3,6,11,0.88)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(125,211,252,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.10)_1px,transparent_1px)] [background-size:72px_72px]"
        />

        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1400px] grid-cols-1 items-end gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:items-center">
          <div className="max-w-4xl pb-5 sm:pb-10">
            <h1 className="max-w-5xl text-[clamp(3rem,12vw,8.8rem)] font-black leading-[0.82] tracking-normal text-white">
              CertiFind
              <span className="block text-[clamp(2.45rem,8vw,6rem)] text-cyan-100">
                Learn in motion.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg md:text-xl md:leading-8">
              A cinematic way to discover courses, compare platforms, and follow a career path that keeps moving with you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#discover"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 text-sm font-black text-slate-950 shadow-[0_18px_80px_rgba(103,232,249,0.28)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explore courses
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="#journey"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-6 text-sm font-black text-white backdrop-blur-xl transition hover:border-cyan-200/60 hover:bg-white/14"
              >
                <CirclePlay className="h-4 w-4 text-emerald-200" />
                Watch the journey
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] pb-6 lg:pb-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/14 bg-black/24 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-md sm:aspect-[5/4] lg:aspect-[4/5]">
              <div
                className="absolute inset-0 bg-cover transition-[background-position,transform] duration-700 ease-out motion-reduce:transition-none"
                style={{
                  backgroundImage: "url('/cinematic/course-journey-sequence.png')",
                  backgroundPosition: spritePosition,
                  backgroundSize: "500% 100%",
                  transform: `scale(${1.06 + frameProgress * 0.06})`,
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,11,0)_0%,rgba(3,6,11,0.82)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="mb-4 flex items-center gap-1.5">
                  {sequenceFrames.map((frame, index) => (
                    <span
                      key={frame.label}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === activeFrame ? "w-10 bg-cyan-200" : "w-3 bg-white/28"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
                  Frame {activeFrame + 1} / {FRAME_COUNT}
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                  {sequenceFrames[activeFrame].title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                  {sequenceFrames[activeFrame].body}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#03060b]" />
      </section>

      <section className="relative z-10 -mt-8 mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4">
        <StatsCounter end={stats.courses} label="Verified Courses" suffix="+" />
        <StatsCounter end={stats.platforms} label="Global Platforms" />
        <StatsCounter end={stats.activeUsers} label="Active Learners" suffix="+" />
        <StatsCounter end={stats.topDepartments} label="Learning Tracks" />
      </section>

      <section id="journey" ref={sequenceRef} className="relative min-h-[420vh] bg-[#03060b]">
        <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-10 sm:top-20 sm:min-h-[calc(100vh-5rem)] sm:px-6 lg:py-14">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="max-w-xl">
              <h2 className="text-[clamp(2.4rem,7vw,5.7rem)] font-black leading-[0.9] tracking-normal text-white">
                Scroll through the learning journey
              </h2>
              <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">
                {sequenceFrames[activeFrame].body}
              </p>
              <div className="mt-8 space-y-3">
                {sequenceFrames.map((frame, index) => (
                  <div
                    key={frame.label}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                      index === activeFrame
                        ? "border-cyan-200/45 bg-cyan-200/10 text-white"
                        : "border-white/8 bg-white/[0.035] text-slate-500"
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-current/30 text-xs font-black">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-black">{frame.label}</p>
                      <p className="text-xs text-current/70">{frame.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[54vh] overflow-hidden rounded-[2rem] border border-white/12 bg-black/40 shadow-[0_40px_140px_rgba(0,0,0,0.55)] sm:min-h-[66vh] lg:min-h-[76vh]">
              <div
                className="absolute inset-0 bg-cover transition-[background-position,transform] duration-700 ease-out motion-reduce:transition-none"
                style={{
                  backgroundImage: "url('/cinematic/course-journey-sequence.png')",
                  backgroundPosition: spritePosition,
                  backgroundSize: "500% 100%",
                  transform: `scale(${1.03 + frameProgress * 0.07})`,
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,11,0.78)_0%,rgba(3,6,11,0.12)_52%,rgba(3,6,11,0.72)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 rounded-3xl border border-white/12 bg-black/36 p-4 backdrop-blur-2xl sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">
                    {sequenceFrames[activeFrame].label}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white sm:text-4xl">
                    {sequenceFrames[activeFrame].title}
                  </h3>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:w-48">
                  <div
                    className="h-full rounded-full bg-cyan-200 transition-[width] duration-300"
                    style={{ width: `${Math.max(8, frameProgress * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/8 bg-[#081014] px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.78fr_1fr]">
          <div>
            <h2 className="max-w-2xl text-[clamp(2.25rem,6vw,5rem)] font-black leading-[0.94] tracking-normal text-white">
              Every platform in one orbit
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Move between university programs, creator-led bootcamps, professional certificates, and free open courses without losing the thread.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/platforms"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
              >
                Explore platforms
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/analyzer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black text-white transition hover:border-emerald-200/60"
              >
                Career Hub
              </Link>
            </div>
          </div>

          <div className="relative grid min-h-[460px] place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#03060b] p-5 sm:p-8">
            <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="absolute h-[72%] w-[72%] rounded-full border border-cyan-200/22" />
            <div className="absolute h-[48%] w-[48%] rounded-full border border-emerald-200/18" />
            <div className="relative z-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {platformSignals.map((platform, index) => (
                <div
                  key={platform.name}
                  className={`group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.055] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/40 ${platform.offset}`}
                >
                  <div className="mb-12 flex items-center justify-between">
                    <Orbit className={`h-6 w-6 ${platform.tone}`} />
                    <span className="text-xs font-black text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{platform.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Courses align by department, price, level, and certification fit.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#03060b] px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#081014] p-5 sm:p-8">
            <div className="absolute inset-x-10 top-12 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
            <div className="relative z-10 grid h-full gap-4">
              {[
                { icon: Compass, title: "Curiosity", text: "Start with a topic, role, or skill gap.", color: "text-cyan-200" },
                { icon: Layers3, title: "Comparison", text: "See platform, price, level, and certificate context together.", color: "text-emerald-200" },
                { icon: GraduationCap, title: "Momentum", text: "Save the route and move straight to the source course.", color: "text-amber-200" },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/22 p-5 backdrop-blur-xl"
                  >
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-current/25 bg-white/6 ${step.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        Stage {index + 1}
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[clamp(2.25rem,6vw,5rem)] font-black leading-[0.94] tracking-normal text-white">
              From curiosity to career momentum
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">
              CertiFind turns browsing into a cinematic path: search, compare, save, and open the source course with the next decision already in focus.
            </p>
          </div>
        </div>
      </section>

      <section id="discover" className="relative bg-[#05080d] px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[0.82fr_1fr]">
            <div>
              <h2 className="text-[clamp(2.4rem,6vw,5.6rem)] font-black leading-[0.9] tracking-normal text-white">
                Start your next certification
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Search the live course catalog, filter by discipline, and open the route that fits your next move.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by keyword, topic, or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-14 w-full rounded-full border border-white/12 bg-white/[0.065] py-4 pl-12 pr-5 text-sm font-semibold text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-200/55 focus:ring-4 focus:ring-cyan-200/10"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="scrollbar-none -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {DEPARTMENTS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-black transition-all duration-300 ${
                  category === value
                    ? "border-cyan-200/60 bg-cyan-200 text-slate-950"
                    : "border-white/10 bg-white/[0.045] text-slate-400 hover:border-white/24 hover:text-white"
                }`}
                suppressHydrationWarning
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-200" />
            </div>
          ) : freeCourses.length === 0 && paidCourses.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/14 bg-white/[0.035] py-24 text-center">
              <Search className="mx-auto mb-4 h-10 w-10 text-slate-600" />
              <h2 className="mb-2 text-xl font-black text-white">No matching courses found</h2>
              <p className="text-sm font-medium text-slate-500">Try a different keyword or department.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-5 rounded-full bg-cyan-200 px-6 py-2 text-sm font-black text-slate-950 transition hover:bg-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-20">
              <CourseSection
                accent="emerald"
                courses={freeCourses}
                icon={<Zap className="h-6 w-6 flex-shrink-0 text-emerald-300 sm:h-7 sm:w-7" />}
                loading={loadingMore === "free"}
                onLoadMore={() => handleLoadMore("free")}
                remaining={totalFree - freeCourses.length}
                title="Open Source Tier"
                total={totalFree}
                viewAllHref="/free-courses"
                viewAllLabel="View all"
              />
              <CourseSection
                accent="amber"
                courses={paidCourses}
                icon={<Award className="h-6 w-6 flex-shrink-0 text-amber-300 sm:h-7 sm:w-7" />}
                loading={loadingMore === "paid"}
                onLoadMore={() => handleLoadMore("paid")}
                remaining={totalPaid - paidCourses.length}
                title="Enterprise Curriculum"
                total={totalPaid}
                viewAllHref="/paid-courses"
                viewAllLabel="Explore all"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CourseSection({
  accent,
  courses,
  icon,
  loading,
  onLoadMore,
  remaining,
  title,
  total,
  viewAllHref,
  viewAllLabel,
}: {
  accent: "emerald" | "amber";
  courses: Course[];
  icon: ReactNode;
  loading: boolean;
  onLoadMore: () => void;
  remaining: number;
  title: string;
  total: number;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  if (courses.length === 0) return null;

  const accentClass = accent === "emerald" ? "text-emerald-300" : "text-amber-300";
  const borderClass = accent === "emerald" ? "border-emerald-300/20" : "border-amber-300/20";
  const hoverClass =
    accent === "emerald"
      ? "hover:border-emerald-300/35 hover:text-emerald-200"
      : "hover:border-amber-300/35 hover:text-amber-200";

  return (
    <div className="space-y-6">
      <div className={`flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-end ${borderClass}`}>
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black text-white sm:text-4xl">
            {icon}
            {title}
            <span className="text-sm font-semibold text-slate-500">({total} courses)</span>
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className={`self-start text-xs font-black uppercase tracking-[0.22em] text-slate-500 transition sm:self-auto ${hoverClass}`}
        >
          {viewAllLabel}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course, idx) => (
          <div
            key={course.course_id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(idx % INITIAL_LIMIT) * 55}ms` }}
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="pt-2 text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-7 text-sm font-black text-slate-400 transition disabled:opacity-50 ${hoverClass}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className={`h-4 w-4 ${accentClass}`} />
                Load more ({remaining} remaining)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
