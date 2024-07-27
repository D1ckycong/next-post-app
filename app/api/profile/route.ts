import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/utils/firebaseConfig";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  signInWithCustomToken,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { verifyUser } from "@/services/userService";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const birthdate = formData.get("birthdate") as string;
    const gender = formData.get("gender") as string;
    const profileIcon = (formData.get("profileIcon") as File) || null;
    const currentPassword = (formData.get("currentPassword") as string) || null;
    const newPassword = (formData.get("newPassword") as string) || null;
    const confirmNewPassword =
      (formData.get("confirmNewPassword") as string) || null;

    if (!username || !email || !birthdate || !gender) {
      return NextResponse.json({
        success: false,
        error: "必須項目が入力されていません。",
      });
    }

    const customToken = await verifyUser();
    if (!customToken) {
      return NextResponse.json({ success: false, message: "認証が必要です。" });
    }


    const userCredential = await signInWithCustomToken(auth, customToken);
    const user = userCredential.user;

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "ユーザーが認証されていません。",
      });
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      return NextResponse.json({
        success: false,
        error: "新しいパスワードが一致しません。",
      });
    }

    if (currentPassword && newPassword) {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "現在のパスワードが間違っています。",
        });
      }
    }

    let profileIconURL = null;
    if (profileIcon) {
      const storage = getStorage();
      const storageRef = ref(storage, `profileIcons/${user.uid}`);
      await uploadBytes(storageRef, profileIcon);
      profileIconURL = await getDownloadURL(storageRef);
    }

    if (username || email || birthdate || gender || profileIconURL) {
      const userDoc = doc(db, "users", user.uid);
      const updateData: { [key: string]: string | null } = {
        username,
        email,
        birthdate,
        gender,
        ...(profileIconURL && { profileIconUrl: profileIconURL }), // profileIconがある場合のみ更新
      };
      await updateDoc(userDoc, updateData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile: ", error);
    return NextResponse.json({
      success: false,
      error: "プロフィールの更新に失敗しました。",
    });
  }
}
