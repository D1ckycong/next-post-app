import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const result = await registerUser(req);
    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
