import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { getUserFromRequest } from "@/lib/auth";

// Configure your API route here
export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest();

    const result = await query("SELECT * FROM sessions WHERE user_id = $1", [
      userId,
    ]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = body.title || "New Session";
  const userId = getUserFromRequest();

  try {
    const result = await query(
      "INSERT INTO sessions (user_id, title) VALUES ($1, $2) RETURNING *",
      [userId, title],
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
