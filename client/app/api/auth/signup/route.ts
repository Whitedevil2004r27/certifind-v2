import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user exists
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await query(
      "SELECT id FROM users WHERE lower(email) = $1",
      [normalizedEmail]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = role === "premium" ? "premium" : "student";

    // Create user in Neon
    await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [fullName, normalizedEmail, hashedPassword, safeRole]
    );

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
