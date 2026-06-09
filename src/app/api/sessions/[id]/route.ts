import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params;
  const userId = await getUserFromRequest();
  try {
    const session = await query(
      "SELECT * FROM sessions WHERE id = $1 AND user_id = $2",
      [sessionId, userId],
    );

    const message = await query(
      "SELECT * FROM messages WHERE sessions_id = $1",
      [sessionId],
    );

    if (session.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({
      session: session.rows[0],
      messages: message.rows,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const sessionId = params.id;
  const userId = getUserFromRequest();
  try {
    await query("DELETE FROM sessions WHERE id = $1 AND user_id = $2", [
      sessionId,
      userId,
    ]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const sessionId = params.id;
  const userId = getUserFromRequest();
  const body = await request.json();
  const title = body.title || "Updated Session";
  try {
    const result = await query(
      "UPDATE sessions SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *",
      [title, sessionId, userId],
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}
