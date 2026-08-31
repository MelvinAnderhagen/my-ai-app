"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      // Here you would typically send the email and password to your backend for authentication
      setError("");

      const result = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!result.ok) {
        const data = await result.json();
        setError(data.error);
        return;
      }

      router.push("/chat");

      console.log("Logging in with:", { email, password });
    } catch (error: any) {
      setError(error);
      throw new Error(error);
    }
  }

  return (
    <div>
      <form
        className="flex flex-col gap-4 max-w-sm mx-auto mt-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <input
          type="text"
          placeholder="email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        {error.length > 0 ? <>{error}</> : <></>}
        <Link href="/register" className="text-blue-600 hover:underline">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}

export default Login;
