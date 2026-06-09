import { NextResponse } from "next/server";
import { chat } from "@/lib/openai";
import { query } from "@/lib/db/index";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const userId = getUserFromRequest();
    const { sessionId: sessionId } = await params;
    const { message } = await request.json();

    const historyResult = await query(
      `SELECT role, content from messages WHERE sessions_id = $1 ORDER BY created_at ASC`,
      [sessionId],
    );

    await query(
      `INSERT INTO messages (sessions_id, role, content) values ($1, $2, $3) RETURNING *`,
      [sessionId, "user", message],
    );

    const result = await chat(historyResult.rows, message);

    await query(
      `INSERT INTO messages (content, tokens_used, sessions_id, role) values ($1, $2, $3, $4)`,
      [result.content, result.tokensUsed, sessionId, "assistant"],
    );

    await query(
      `UPDATE users SET tokens_used = tokens_used + $1 WHERE id = $2`,
      [result.tokensUsed, userId],
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
