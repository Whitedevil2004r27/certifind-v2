'use server';

import { query } from "@/lib/db";
import { getAppUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

export async function toggleBookmarkAction(courseId: string) {
  const user = await getAppUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  // Check if exists
  const existing = await query(
    "SELECT * FROM bookmarks WHERE user_id = $1 AND course_id = $2",
    [userId, courseId]
  );

  if (existing.length > 0) {
    // Delete
    await query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND course_id = $2",
      [userId, courseId]
    );
    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/bookmarks");
    return { isBookmarked: false };
  } else {
    // Insert
    await query(
      "INSERT INTO bookmarks (user_id, course_id) VALUES ($1, $2)",
      [userId, courseId]
    );
    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/bookmarks");
    return { isBookmarked: true };
  }
}

export async function getBookmarkStatus(courseId: string) {
  const user = await getAppUser();
  if (!user?.id) return false;

  const userId = user.id;
  const existing = await query(
    "SELECT * FROM bookmarks WHERE user_id = $1 AND course_id = $2",
    [userId, courseId]
  );

  return existing.length > 0;
}
