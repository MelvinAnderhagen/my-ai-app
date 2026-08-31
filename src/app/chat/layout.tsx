"use client";
import Sessions from "@/components/Sessions";
import "@/styles/chat/layout.css";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sessions />
      <main className="ml-65 flex-1">
        {" "}
        {/* offset by sessions width */}
        {children}
      </main>
    </div>
  );
}
