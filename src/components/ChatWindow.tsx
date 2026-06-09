"use client";
import Message from "@/types/Chat/Message";
import React, { useEffect, useRef, useState } from "react";
import Loading from "./ui/Loading";
import "@/styles/chat/chat.css";

type Props = {
  sessionId: string;
};

function ChatWindow({ sessionId }: Props) {
  const [messages, setMessages] = useState<Message[]>();
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      async function fetchMessages() {
        try {
          const result = await fetch(`/api/sessions/${sessionId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          const data = await result.json();

          setMessages(data.messages);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      }

      fetchMessages();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    if (!input.trim()) return;
    setIsSending(true);

    const sentMessage = await fetch(`/api/openai/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const result = await sentMessage.json();

    setMessages((prev) => [
      ...(prev || []),
      { id: Date.now().toString(), role: "user" as const, content: input },
      {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: result.content,
      },
    ]);

    setInput("");
    setIsSending(false);
  }

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-lg px-4 py-2 rounded-2xl text-sm ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-3 flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
