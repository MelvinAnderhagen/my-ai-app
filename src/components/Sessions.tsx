import React, { useEffect, useState } from "react";
import Loading from "./ui/Loading";
import GETSession from "@/types/Session/GETSession";
import Link from "next/link";
import "@/styles/chat/sessions.css";
import { usePathname } from "next/navigation";

function Sessions() {
  const [sessions, setSessions] = useState<GETSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();

  async function getSessions() {
    setIsLoading(true);
    try {
      const result = await fetch("/api/sessions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!result.ok) {
        const error = await result.json();
        console.error(error);
        return;
      }

      const data = await result.json();

      if (!Array.isArray(data)) {
        console.log("Expected array, got:", data);
        return;
      }

      console.log("Sessions response:", data);
      console.log("Is array?", Array.isArray(data));

      setSessions(data);
      setIsLoading(false);
    } catch (err: any) {
      console.log("Sessions fetch error", err);
      setIsLoading(false);
      return err.message;
    }
  }

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <div className="fixed left-48 top-0 h-screen w-48 flex flex-col items-stretch border-r border-gray-200 bg-white px-3 py-4">
      <h2 className="text-xl font-bold">Chats</h2>
      <div className="mt-4 flex w-full flex-col gap-3">
        {isLoading ? (
          <Loading />
        ) : (
          sessions?.map((session) => (
            <Link
              key={session.id}
              href={`/chat/${session.id}`}
              className="w-full"
            >
              <div
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                  pathname === `/chat/${session.id}`
                    ? "bg-slate-100 text-slate-900 border-slate-300"
                    : "bg-white text-slate-900 border-gray-200 hover:bg-slate-50"
                }`}
              >
                {session.title}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Sessions;
