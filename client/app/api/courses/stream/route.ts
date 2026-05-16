import { query } from '@/lib/db';
import { getFallbackLiveCourses } from '@/lib/fallback-catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LiveCourse = {
  course_id: string;
  title: string;
  platform: string;
  course_type: string;
  rating: number;
  thumbnail_url?: string | null;
  updated_at?: string | null;
};

const encoder = new TextEncoder();
const intervalMs = 10000;
const snapshotTtlMs = 7000;
let latestSnapshot:
  | {
      expiresAt: number;
      courses: LiveCourse[];
    }
  | null = null;

function eventChunk(event: string, payload: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
}

async function fetchLatestCourses() {
  if (latestSnapshot && latestSnapshot.expiresAt > Date.now()) {
    return latestSnapshot.courses;
  }

  const courses = await query<LiveCourse>(
    `
    SELECT course_id, title, platform, course_type, rating, thumbnail_url, updated_at
    FROM courses
    ORDER BY COALESCE(updated_at, scraped_at, last_updated::timestamptz, now()) DESC
    LIMIT 8
    `
  );

  latestSnapshot = {
    expiresAt: Date.now() + snapshotTtlMs,
    courses,
  };

  return courses;
}

export async function GET() {
  let closed = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const sendSnapshot = async () => {
        if (closed) return;

        try {
          const courses = await fetchLatestCourses();
          controller.enqueue(eventChunk('snapshot', {
            source: 'neon',
            courses,
            lastSynced: new Date().toISOString(),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Realtime course stream failed';
          controller.enqueue(eventChunk('snapshot', {
            source: 'cached',
            courses: getFallbackLiveCourses(),
            lastSynced: new Date().toISOString(),
            warning: 'Neon is temporarily unavailable. Streaming cached course updates.',
          }));
          controller.enqueue(eventChunk('stream-warning', { message }));
        }
      };

      controller.enqueue(eventChunk('connected', { ok: true, intervalMs }));
      await sendSnapshot();

      timer = setInterval(sendSnapshot, intervalMs);
    },
    cancel() {
      closed = true;
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
