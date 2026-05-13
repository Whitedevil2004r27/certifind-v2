import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAppUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}
