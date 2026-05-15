"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  Database,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  X,
} from "lucide-react";
import CourseCard, { Course } from "@/components/CourseCard";

type Platform = {
  id: string;
  name: string;
  category: string;
};

type LiveCourse = Pick<Course, "course_id" | "title" | "platform" | "course_type" | "rating" | "thumbnail_url" | "updated_at">;
type DataSource = "neon" | "cached";

type Props = {
  variant?: "dashboard" | "public";
  signedInName?: string;
};

const COURSE_TYPES = ["All", "Free", "Paid"] as const;
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"] as const;
const SORTS = [
  { value: "updated", label: "Live" },
  { value: "rating", label: "Rating" },
  { value: "popularity", label: "Popular" },
  { value: "newest", label: "Newest" },
] as const;

function formatTime(value?: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildCourseParams({
  search,
  courseType,
  platform,
  level,
  sort,
}: {
  search: string;
  courseType: string;
  platform: string;
  level: string;
  sort: string;
}) {
  const params = new URLSearchParams({
    page: "1",
    limit: "12",
    sort_by: sort,
  });

  if (search.trim()) params.set("search", search.trim());
  if (courseType !== "All") params.set("course_type", courseType);
  if (platform !== "All") params.set("platform", platform);
  if (level !== "All") params.set("level", level);

  return params;
}

export default function RealtimeCourseModule({ variant = "public", signedInName }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [liveCourses, setLiveCourses] = useState<LiveCourse[]>([]);
  const [search, setSearch] = useState("");
  const requestRef = useRef(0);
  const [courseType, setCourseType] = useState<(typeof COURSE_TYPES)[number]>("All");
  const [platform, setPlatform] = useState("All");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("updated");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [streamState, setStreamState] = useState<"connecting" | "live" | "offline">("connecting");
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>("neon");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const hasFilters = Boolean(search.trim() || courseType !== "All" || platform !== "All" || level !== "All");

  const fetchCourses = useCallback(async (showRefreshing = false) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const params = buildCourseParams({
        search,
        courseType,
        platform,
        level,
        sort,
      });
      const response = await fetch(`/api/courses?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Courses could not be loaded");

      if (requestId !== requestRef.current) return;
      setCourses(data.courses || []);
      setDataSource(data.source === "cached" ? "cached" : "neon");
      setStatusMessage(data.warning || "");
    } catch (err) {
      if (requestId !== requestRef.current) return;
      const message = err instanceof Error ? err.message : "Courses could not be loaded";
      setError(message);
      setCourses([]);
    } finally {
      if (requestId !== requestRef.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseType, level, platform, search, sort]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/platforms", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted && Array.isArray(data)) setPlatforms(data);
      })
      .catch(() => {
        if (mounted) setPlatforms([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchCourses]);

  useEffect(() => {
    const source = new EventSource("/api/courses/stream");

    source.addEventListener("connected", () => {
      setStreamState("live");
    });

    source.addEventListener("snapshot", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as {
        courses?: LiveCourse[];
        lastSynced?: string;
        source?: DataSource;
        warning?: string;
      };

      setStreamState("live");
      setLastSynced(payload.lastSynced || new Date().toISOString());
      setLiveCourses(payload.courses || []);
      setDataSource(payload.source === "cached" ? "cached" : "neon");
      setStatusMessage(payload.warning || "");

      if (!hasFilters && sort === "updated") {
        fetchCourses(true);
      }
    });

    source.addEventListener("stream-warning", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { message?: string };
      setStreamState("live");
      setStatusMessage(payload.message || "Neon is temporarily unavailable. Showing cached updates.");
    });

    source.onerror = () => {
      setStreamState("offline");
    };

    return () => {
      source.close();
    };
  }, [fetchCourses, hasFilters, sort]);

  const platformOptions = useMemo(
    () => ["All", ...platforms.map((entry) => entry.name)],
    [platforms]
  );

  const activeLabel = useMemo(() => {
    const labels = [courseType, platform, level].filter((value) => value !== "All");
    if (search.trim()) labels.unshift(`"${search.trim()}"`);
    return labels.length ? labels.join(" / ") : "All courses";
  }, [courseType, level, platform, search]);

  const resetFilters = () => {
    setSearch("");
    setCourseType("All");
    setPlatform("All");
    setLevel("All");
    setSort("updated");
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200/80">
            <span className="inline-flex items-center gap-2">
              <Signal className={`h-4 w-4 ${streamState === "live" && dataSource === "neon" ? "text-emerald-300" : "text-amber-300"}`} />
              {streamState === "live" && dataSource === "cached"
                ? "Cached live feed"
                : streamState === "live"
                  ? "Live sync"
                  : streamState === "connecting"
                    ? "Connecting"
                    : "Reconnecting"}
            </span>
            <span className="text-white/20">/</span>
            <span>{variant === "dashboard" ? "Course operations" : "Course command center"}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {variant === "dashboard" && signedInName ? `${signedInName}'s learning dashboard` : "Real-time course intelligence"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Search the live Neon catalog, watch fresh course updates arrive, and save modules into a responsive learning workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
          {[
            { label: dataSource === "cached" ? "Cached feed" : "Live feed", value: liveCourses.length || 0, icon: Activity, color: dataSource === "cached" ? "text-amber-300" : "text-emerald-300" },
            { label: "Visible", value: courses.length, icon: BookOpen, color: "text-cyan-300" },
            { label: "Secured", value: "Clerk", icon: ShieldCheck, color: "text-amber-300" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Icon className={`mb-3 h-5 w-5 ${color}`} />
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_160px_180px_160px_150px_auto]">
        <label className="relative block min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses, instructors"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-black/60"
          />
        </label>

        <select
          value={courseType}
          onChange={(event) => setCourseType(event.target.value as (typeof COURSE_TYPES)[number])}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none transition focus:border-cyan-300/50"
          aria-label="Course type"
        >
          {COURSE_TYPES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <select
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none transition focus:border-cyan-300/50"
          aria-label="Platform"
        >
          {platformOptions.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <select
          value={level}
          onChange={(event) => setLevel(event.target.value as (typeof LEVELS)[number])}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none transition focus:border-cyan-300/50"
          aria-label="Level"
        >
          {LEVELS.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as (typeof SORTS)[number]["value"])}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none transition focus:border-cyan-300/50"
          aria-label="Sort courses"
        >
          {SORTS.map((entry) => (
            <option key={entry.value} value={entry.value}>{entry.label}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fetchCourses(true)}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15 lg:flex-none"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-slate-400 transition hover:text-white"
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-5 flex flex-col justify-between gap-3 border-y border-white/10 py-4 text-sm text-slate-400 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <Filter className="h-4 w-4 flex-shrink-0 text-cyan-200" />
          <span className="truncate">{activeLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-300" />
            {dataSource === "cached" ? "Cached catalog" : "Neon synced"}
          </span>
          <span>{lastSynced ? `Updated ${formatTime(lastSynced)}` : "Waiting for first sync"}</span>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100/80">
          {statusMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {error ? (
            <div className="rounded-3xl border border-rose-500/25 bg-rose-500/10 p-8 text-center">
              <SlidersHorizontal className="mx-auto mb-3 h-8 w-8 text-rose-300" />
              <h2 className="text-xl font-black text-white">Course feed unavailable</h2>
              <p className="mt-2 text-sm text-rose-100/70">{error}</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[460px] rounded-3xl border border-white/10 bg-white/[0.045] animate-pulse" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {courses.map((course, index) => (
                <div
                  key={course.course_id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
              <Search className="mx-auto mb-3 h-9 w-9 text-slate-600" />
              <h2 className="text-xl font-black text-white">No matching courses</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Try a broader search or clear one of the active filters.</p>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 xl:sticky xl:top-28 xl:self-start">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white">Live updates</h2>
              <p className="text-xs font-semibold text-slate-500">
                {dataSource === "cached" ? "Cached course changes" : "Newest Neon course changes"}
              </p>
            </div>
            <span className={`h-3 w-3 rounded-full ${streamState === "live" && dataSource === "neon" ? "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" : "bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.55)]"}`} />
          </div>

          <div className="space-y-3">
            {liveCourses.length > 0 ? liveCourses.map((course) => (
              <div key={course.course_id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${course.course_type === "Free" ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200"}`}>
                    {course.course_type}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{formatTime(course.updated_at)}</span>
                </div>
                <h3 className="line-clamp-2 text-sm font-black leading-5 text-white">{course.title}</h3>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                  <span className="truncate">{course.platform}</span>
                  <span className="text-amber-300">{Number(course.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                Waiting for the first course snapshot.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
