import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

type user = {
  id: string;
  password: string;
  email: string;
};

export async function POST(request: NextRequest) {
  console.log("login route hit.");
  try {
    console.log("try block reached");
    const body = await request.json();
    const { email, password }: user = body;

    const user = await query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email],
    );

    if (user.rows.length === 0) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password);

    if (!isValid) {
      return NextResponse.json({
        error: "Password dosen't match",
        status: 404,
      });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      { user: user.rows[0].id, email: user.rows[0].email },
      { status: 200 },
    );
    console.log("Setting cookie with token:", token.substring(0, 20) + "...");
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    console.log("Response headers:", response.headers.get("set-cookie"));
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
