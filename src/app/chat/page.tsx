"use client";
import React, { useState } from "react";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleNewSession() {
    setIsLoading(true);
    try {
      const result = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Session" }),
      });
      const data = await result.json();
      router.push(`/chat/${data.id}`);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-3xl">🧠</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to MindDesk
      </h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        Your AI productivity assistant. Start a new session or pick one from the
        sidebar to continue.
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-md">
        {[
          "✍️ Help me write an email",
          "📚 Explain a concept",
          "🗂️ Summarize my notes",
          "💡 Brainstorm ideas",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={handleNewSession}
            className="text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleNewSession}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium transition"
      >
        + Start New Session
      </button>
    </div>
  );
}
