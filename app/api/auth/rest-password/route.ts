import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await sendPasswordResetEmail(auth, email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
