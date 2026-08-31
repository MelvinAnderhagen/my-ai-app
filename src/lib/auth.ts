import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type DecodedToken = {
  userId: number;
  email: string;
};

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

  return decoded.userId;
}

// export function getUserFromRequest(request: Request): number {
//   const cookieHeader = request.headers.get("cookie");
//   const token = cookieHeader
//     ?.split(";")
//     .find((c) => c.trim().startsWith("token="))
//     ?.split("=")[1];

//   if (!token) {
//     throw new Error("No token provided");
//   }

//   const decoded = jwt.verify(
//     token,
//     process.env.JWT_SECRET as string,
//   ) as DecodedToken;

//   return decoded.userId;
// }
