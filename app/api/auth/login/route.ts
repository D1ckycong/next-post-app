import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();

    const response = NextResponse.json({ success: true, idToken });

    return response;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential"){
      return NextResponse.json({ success: false, message: "メールアドレスまたはパスワードが間違っています。" });
    }
    
      console.error("Login failed:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
