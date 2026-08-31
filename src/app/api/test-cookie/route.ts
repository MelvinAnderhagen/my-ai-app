import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "test" });
  response.cookies.set("test", "123", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
