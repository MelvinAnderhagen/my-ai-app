// Configure your API route here
import { NextResponse } from "next/server";
import { chat, type Message } from "../../../lib/openai";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 },
      );
    }

    // Remove an initial system prompt if present
    const withoutSystem =
      messages[0]?.role === "system" ? messages.slice(1) : messages;

    // Last message is the user's new message
    const last = withoutSystem[withoutSystem.length - 1];
    const historyRaw = withoutSystem.slice(0, -1);

    const history: Message[] = historyRaw.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? ""),
    }));

    const userMessage = last?.content ?? "";

    const result = await chat(history, userMessage);

    // Shape response like OpenAI chat completions for client compatibility
    const data = {
      choices: [{ message: { content: result.content } }],
      usage: { total_tokens: result.tokensUsed },
    };

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
