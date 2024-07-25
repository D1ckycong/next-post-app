import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    serialize("token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: -1, // クッキーを削除する
    })
  );

  return response;
}
