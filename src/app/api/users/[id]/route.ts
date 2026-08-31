import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await params.id;
  try {
    const result = await query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = params.id;
  try {
    await query("DELETE FROM users WHERE id = $1", [userId]);
    return NextResponse.json({
      message: "User deleted successfully",
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = params.id;
  const body = await request.json();
  const { name, email, password } = body;
  try {
    const result = await query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, created_at",
      [name, email, password, userId],
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
