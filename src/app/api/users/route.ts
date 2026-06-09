import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";

export async function GET() {
  try {
    const result = await query("SELECT id, name, email, created_at FROM users");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  try {
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, password],
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
