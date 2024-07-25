import { NextRequest } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/utils/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const getMimeType = (filePath: string): string => {
  const extension = filePath.split(".").pop();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export async function registerUser(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const birthdate = formData.get("birthdate") as string;
  const gender = formData.get("gender") as string;
  const profileIcon = formData.get("profileIcon") as Blob;

  if (
    !username ||
    !email ||
    !password ||
    !birthdate ||
    !gender ||
    !profileIcon
  ) {
    throw new Error("無効なデータ形式");
  }

  // ユーザー名の重複チェック
  const usernameQuery = query(
    collection(db, "users"),
    where("username", "==", username)
  );
  const usernameSnapshot = await getDocs(usernameQuery);
  if (!usernameSnapshot.empty) {
    throw new Error("ユーザー名が既に存在します");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const storageRef = ref(storage, `profileIcons/${user.uid}`);
    const metadata = {
      contentType: getMimeType((profileIcon as File).name),
    };

    // Blobとしてアップロード
    await uploadBytesResumable(storageRef, profileIcon, metadata);
    const profileIconUrl = await getDownloadURL(storageRef);

    // Firestoreにユーザードキュメントを作成
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      email,
      birthdate,
      gender,
      profileIconUrl,
    });

    // プロファイルを更新
    await updateProfile(user, {
      displayName: username,
      photoURL: profileIconUrl,
    });

    return { message: "アカウント作成成功" };
  } catch (error: any) {
    // Firebase Authenticationのエラー処理
    if (error.code === "auth/email-already-in-use") {
      throw new Error("そのメールアドレスは既に使用されています");
    } else {
      throw new Error(`アカウント作成に失敗しました: ${error.message}`);
    }
  }
}
