import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const SYSTEM_PROMPT =
  "You are a helpful assistant that provides concise and accurate answers to user questions. Always respond in a clear and informative manner, and avoid unnecessary details. If you don't know the answer, say you don't know instead of making something up.";
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "500");
const CONTEXT_LIMIT = 10;

export type Message = {
  role: "user" | "assistant";
  content: string;
};

// Function to handle chat interactions with OpenAI API
export async function chat(history: Message[], userMessage: string) {
  const trimmedHistory = history.slice(-CONTEXT_LIMIT);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: MAX_TOKENS,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...trimmedHistory,
      { role: "user", content: userMessage },
    ],
  });

  const content = response.choices[0].message.content;
  const tokensUsed = response.usage?.total_tokens || 0;

  return { content, tokensUsed };
}
